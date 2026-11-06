import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { capturePayPalOrder } from '@/lib/paypal';

// In-memory only. Cleared on process restart. Production must use a DB unique constraint on paypal_order_id.
// Server-side captured order cache to enforce idempotency and reject duplicates
const capturedOrders = new Set<string>();

const CaptureOrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  amountPaise: z.number().int().positive('Amount must be positive integer paise'),
  contributorName: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = CaptureOrderSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || 'Invalid request payload' },
        { status: 400 }
      );
    }

    const { orderId, projectId, amountPaise, contributorName, message } = parseResult.data;

    // Acceptance rule: Duplicate capture rejected
    if (capturedOrders.has(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate payment capture rejected: Order ${orderId} has already been captured and processed.`,
          isDuplicate: true,
        },
        { status: 409 }
      );
    }

    // Verify and capture server-side
    const captureResult = await capturePayPalOrder(orderId);

    const isSuccess =
      captureResult.status === 'COMPLETED' ||
      captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.status === 'COMPLETED';

    if (!isSuccess) {
      return NextResponse.json(
        { success: false, error: 'Payment capture was not completed by PayPal' },
        { status: 400 }
      );
    }

    // Mark as captured
    capturedOrders.add(orderId);

    const captureId =
      captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id || `CAP-${Date.now()}`;

    // Extract INR paise amount from custom_id if available; fallback to passed amountPaise
    const unit = captureResult.purchase_units?.[0];
    const customIdFromCapture =
      unit?.payments?.captures?.[0]?.custom_id ||
      unit?.custom_id;
    const finalAmountPaise =
      customIdFromCapture && !isNaN(Number(customIdFromCapture)) && Number(customIdFromCapture) > 0
        ? parseInt(customIdFromCapture, 10)
        : amountPaise;

    return NextResponse.json({
      success: true,
      message: 'Payment verified and captured successfully',
      captureId,
      orderId,
      projectId,
      amountPaise: finalAmountPaise,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payment capture failed' },
      { status: 500 }
    );
  }
}
