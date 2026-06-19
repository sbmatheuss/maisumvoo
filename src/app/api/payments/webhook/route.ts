import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { db } from "@/lib/db";

// IMPORTANT: This route must NOT use bodyParser. The raw body is needed
// to verify the Stripe webhook signature.
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: string;

  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ received: false, error: "Cannot read body" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Webhook] Missing stripe-signature header");
    return NextResponse.json(
      { received: false, error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("[Webhook] Signature verification failed:", message);
    return NextResponse.json({ received: false, error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          await db.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
          });
          console.log(`[Webhook] Booking ${bookingId} confirmed via payment_intent.succeeded`);
        } else {
          console.warn("[Webhook] payment_intent.succeeded sem bookingId nos metadata");
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        // Mantém PENDING — não altera o status
        if (bookingId) {
          console.log(
            `[Webhook] Payment failed for booking ${bookingId}. Status remains PENDING.`
          );
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    // Loga o erro mas retorna 200 assim mesmo (boa prática de webhook)
    console.error("[Webhook] Error processing event:", err);
  }

  // Sempre retorna 200 para o Stripe não retentar
  return NextResponse.json({ received: true }, { status: 200 });
}
