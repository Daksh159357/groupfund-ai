import { NextRequest, NextResponse } from 'next/server';

// In-memory processed webhook event ID set for idempotency
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody);

    const eventId = event.id;
    if (eventId && processedEvents.has(eventId)) {
      return NextResponse.json({ message: 'Event already processed (idempotent)' });
    }

    if (eventId) {
      processedEvents.add(eventId);
    }

    const eventType = event.event_type;

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const capture = event.resource;
        console.info(`[Webhook] Capture completed: ${capture.id}, Amount: ${capture.amount?.value} ${capture.amount?.currency_code}`);
        break;
      }
      case 'CHECKOUT.ORDER.APPROVED': {
        const order = event.resource;
        console.info(`[Webhook] Order approved by buyer: ${order.id}`);
        break;
      }
      default:
        console.info(`[Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Webhook error' }, { status: 400 });
  }
}
