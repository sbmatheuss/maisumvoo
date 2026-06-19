import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export const dynamic = 'force-dynamic';

const passengerSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve ter 11 dígitos numéricos"),
  dateOfBirth: z.string().datetime({ offset: true }).or(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inválida")
  ),
  type: z.enum(["ADULT", "CHILD", "INFANT"]),
  seatNumber: z.string().optional(),
});

const bookingSchema = z.object({
  flightOfferId: z.string().min(1, "ID da oferta é obrigatório"),
  amadeus_offerId: z.string().min(1, "ID Amadeus é obrigatório"),
  passengers: z
    .array(passengerSchema)
    .min(1, "Pelo menos 1 passageiro é obrigatório"),
  contactEmail: z.string().email("E-mail de contato inválido"),
  contactPhone: z.string().min(8, "Telefone de contato inválido"),
  totalAmount: z.number().positive("Valor total deve ser positivo"),
  origin: z
    .string()
    .length(3, "Código IATA de origem inválido")
    .toUpperCase(),
  destination: z
    .string()
    .length(3, "Código IATA de destino inválido")
    .toUpperCase(),
  departureAt: z.string().min(1, "Data de partida é obrigatória"),
  arrivalAt: z.string().min(1, "Data de chegada é obrigatória"),
  airline: z.string().min(1, "Companhia aérea é obrigatória"),
  flightNumber: z.string().min(1, "Número do voo é obrigatório"),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ bookingId: string }>>> {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");

      return NextResponse.json(
        { data: null, error: `Dados inválidos: ${errorMessage}` },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Convert totalAmount to cents (integer) for Prisma
    const totalAmountCents = Math.round(data.totalAmount * 100);

    const existingUser = await db.user.findUnique({
      where: { email: data.contactEmail },
      select: { id: true },
    });

    const booking = await db.booking.create({
      data: {
        userId: existingUser?.id ?? null,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        status: "PENDING",
        totalAmount: totalAmountCents,
        currency: "BRL",
        amadeus_offerId: data.amadeus_offerId,
        origin: data.origin,
        destination: data.destination,
        departureAt: new Date(data.departureAt),
        arrivalAt: new Date(data.arrivalAt),
        airline: data.airline,
        flightNumber: data.flightNumber,
        passengers: {
          create: data.passengers.map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            cpf: p.cpf,
            dateOfBirth: new Date(p.dateOfBirth),
            type: p.type,
            seatNumber: p.seatNumber,
          })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json(
      { data: { bookingId: booking.id }, error: null },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/bookings] Unexpected error:", err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
