import Stripe from "stripe";

type PaymentMethodType = "card" | "pix" | "boleto";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurada");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" as any });
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  bookingId: string,
  paymentMethod: PaymentMethodType = "card"
): Promise<Stripe.PaymentIntent> {
  const params: Stripe.PaymentIntentCreateParams = {
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata: { bookingId },
  };

  if (paymentMethod === "card") {
    params.automatic_payment_methods = { enabled: true };
  } else {
    params.payment_method_types = [paymentMethod];
  }

  return getStripe().paymentIntents.create(params);
}

export function constructWebhookEvent(body: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  return getStripe().webhooks.constructEvent(body, signature, webhookSecret);
}
