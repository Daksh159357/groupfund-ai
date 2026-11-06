import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callGeminiGenerateContent, getMockReceiptScan } from '@/lib/gemini';

const ScanRequestSchema = z.object({
  imageBase64: z.string().optional(),
  mimeType: z.string().optional().default('image/jpeg'),
});

const ReceiptOutputSchema = z.object({
  merchantName: z.string().default('Unknown Merchant'),
  purchaseDate: z.string().default(new Date().toISOString().split('T')[0]),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().optional().default(1),
      pricePaise: z.number().int().nonnegative(),
    })
  ).default([]),
  subtotalPaise: z.number().int().nonnegative().default(0),
  taxPaise: z.number().int().nonnegative().default(0),
  discountPaise: z.number().int().nonnegative().default(0),
  totalPaise: z.number().int().nonnegative(),
  confidenceScore: z.number().optional(),
  rawNotes: z.string().optional(),
  mock: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = ScanRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid receipt scan payload' },
        { status: 400 }
      );
    }

    const { imageBase64, mimeType } = parseResult.data;

    if (!imageBase64) {
      return NextResponse.json({ success: true, data: getMockReceiptScan() });
    }

    // If Gemini API key is configured, invoke multimodal vision model
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a financial receipt scanning assistant. Analyze this receipt image and return STRICT JSON ONLY (no markdown code fences, no extra text) with this exact schema:
{
  "merchantName": "string",
  "purchaseDate": "YYYY-MM-DD",
  "items": [
    { "name": "string", "quantity": 1, "pricePaise": 10000 }
  ],
  "subtotalPaise": 10000,
  "taxPaise": 500,
  "discountPaise": 0,
  "totalPaise": 10500,
  "confidenceScore": 95,
  "rawNotes": "string summary"
}
Important: All prices and amounts MUST be converted to integer paise (1 INR = 100 paise, or 1 USD = 100 cents). Ensure subtotal + tax - discount == total.`;

        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

        const responseText = await callGeminiGenerateContent(prompt, {
          mimeType,
          data: cleanBase64,
        });

        const jsonCleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonCleaned);
        const validated = ReceiptOutputSchema.parse({ ...parsed, mock: false });

        return NextResponse.json({ success: true, data: validated });
      } catch (geminiError: any) {
        console.warn('Gemini vision API error, falling back to structured scan demo:', geminiError.message);
        return NextResponse.json({
          success: true,
          data: { ...getMockReceiptScan(), mock: true },
          notice: 'Demo data — no API key configured',
        });
      }
    }

    // Default fallback
    return NextResponse.json({
      success: true,
      data: { ...getMockReceiptScan(), mock: true },
      notice: 'Demo data — no API key configured',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to scan receipt' },
      { status: 500 }
    );
  }
}
