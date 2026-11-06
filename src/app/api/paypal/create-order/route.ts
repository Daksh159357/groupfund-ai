import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPayPalOrder } from '@/lib/paypal';

const CreateOrderSchema = z.object({
  amountPaise: z.number().int().positive('Contribution amount must be positive integer paise'),
  projectId: z.string().min(1, 'Project ID is required'),
  projectTitle: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = CreateOrderSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 }
      );
    }

    const { amountPaise, projectId, projectTitle } = parseResult.data;

    // Convert paise to currency value (charged in USD at fixed demo rate 83 INR/USD)
    const valueRupees = (amountPaise / 100).toFixed(2);
    const approxUSD = (amountPaise / 100 / 83).toFixed(2);

    const order = await createPayPalOrder({
      amountPaise,
      amountValue: approxUSD,
      currencyCode: 'USD',
      customId: projectId,
      description: `Support Innovation: ${projectTitle || 'Engineering Project'} (₹${valueRupees})`,
    });

    const approveLink = order.links?.find((l: any) => l.rel === 'approve' || l.rel === 'payer-action');

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approveUrl: approveLink?.href,
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Order creation failed' },
      { status: 500 }
    );
  }
}
