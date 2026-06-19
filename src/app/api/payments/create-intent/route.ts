import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createPaymentIntent } from "@/lib/stripe";
import type { ApiResponse, FraudCheckResult } from "@/types";

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  bookingId: z.string().min(1, "bookingId é obrigatório"),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ clientSecret: string }>>> {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors.map((e) => e.message).join("; ");
      return NextResponse.json(
        { data: null, error: errorMessage },
        { status: 400 }
      );
    }

    const { bookingId } = parsed.data;

    // Busca o booking no Prisma
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { passengers: true },
    });

    if (!booking) {
      return NextResponse.json(
        { data: null, error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { data: null, error: "Não é possível processar pagamento de uma reserva cancelada" },
        { status: 409 }
      );
    }

    if (booking.status === "CONFIRMED") {
      return NextResponse.json(
        { data: null, error: "Reserva já confirmada e paga" },
        { status: 409 }
      );
    }

    // Chama fraud-check internamente antes de criar o PaymentIntent
    let fraudResult: FraudCheckResult | null = null;

    try {
      const baseUrl = request.nextUrl.origin;
      const fraudResponse = await fetch(`${baseUrl}/api/agents/fraud-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking: {
            flightOfferId: booking.amadeus_offerId ?? bookingId,
            amadeus_offerId: booking.amadeus_offerId,
            totalAmount: booking.totalAmount / 100,
            contactEmail: booking.contactEmail ?? "",
            contactPhone: booking.contactPhone ?? "",
            origin: booking.origin,
            destination: booking.destination,
            departureAt: booking.departureAt.toISOString(),
            arrivalAt: booking.arrivalAt.toISOString(),
            airline: booking.airline,
            flightNumber: booking.flightNumber,
            passengers: booking.passengers.map((p) => ({
              firstName: p.firstName,
              lastName: p.lastName,
              cpf: p.cpf,
              dateOfBirth: p.dateOfBirth.toISOString(),
              type: p.type,
            })),
          },
          passengers: booking.passengers.map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            cpf: p.cpf,
            dateOfBirth: p.dateOfBirth.toISOString(),
            type: p.type,
          })),
          userAgent: request.headers.get("user-agent") ?? undefined,
        }),
      });

      if (fraudResponse.ok) {
        const fraudData = await fraudResponse.json();
        fraudResult = fraudData.data as FraudCheckResult;
      }
    } catch (fraudErr) {
      // Se o fraud check falhar, loga mas não bloqueia (fail open)
      console.warn("[create-intent] Fraud check unavailable:", fraudErr);
    }

    if (fraudResult && fraudResult.risk === "HIGH") {
      return NextResponse.json(
        {
          data: null,
          error: `Pagamento bloqueado por análise de risco: ${fraudResult.reason}`,
        },
        { status: 403 }
      );
    }

    // Converte de centavos para reais (o Stripe recebe em centavos novamente via createPaymentIntent)
    const amountInReais = booking.totalAmount / 100;

    const paymentIntent = await createPaymentIntent(
      amountInReais,
      booking.currency,
      bookingId
    );

    // Atualiza o booking com o stripePaymentIntentId
    await db.booking.update({
      where: { id: bookingId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("client_secret não retornado pelo Stripe");
    }

    return NextResponse.json({
      data: { clientSecret: paymentIntent.client_secret },
      error: null,
    });
  } catch (err) {
    console.error("[POST /api/payments/create-intent] Unexpected error:", err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
