import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";
import { Booking, Passenger } from "@prisma/client";

export const dynamic = 'force-dynamic';

type BookingWithPassengers = Booking & { passengers: Passenger[] };

const patchSchema = z.object({
  action: z.enum(["cancel"], {
    errorMap: () => ({ message: 'Ação inválida. Use "cancel".' }),
  }),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<BookingWithPassengers>>> {
  try {
    const booking = await db.booking.findUnique({
      where: { id: params.id },
      include: { passengers: true },
    });

    if (!booking) {
      return NextResponse.json(
        { data: null, error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: booking, error: null });
  } catch (err) {
    console.error(`[GET /api/bookings/${params.id}] Unexpected error:`, err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<BookingWithPassengers>>> {
  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors.map((e) => e.message).join("; ");
      return NextResponse.json(
        { data: null, error: errorMessage },
        { status: 400 }
      );
    }

    const existing = await db.booking.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    if (existing.status === "CANCELLED") {
      return NextResponse.json(
        { data: null, error: "Reserva já está cancelada" },
        { status: 409 }
      );
    }

    const updated = await db.booking.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
      include: { passengers: true },
    });

    return NextResponse.json({ data: updated, error: null });
  } catch (err) {
    console.error(`[PATCH /api/bookings/${params.id}] Unexpected error:`, err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
