import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Booking, Passenger } from "@prisma/client";
import type { ApiResponse } from "@/types";

export const dynamic = 'force-dynamic';

type BookingWithPassengers = Booking & { passengers: Passenger[] };

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<BookingWithPassengers[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim();
    const cpf = searchParams.get("cpf")?.trim();

    if (!email && !cpf) {
      return NextResponse.json(
        { data: null, error: "Informe o parâmetro 'email' ou 'cpf'." },
        { status: 400 }
      );
    }

    let bookings: BookingWithPassengers[] = [];

    if (email) {
      // Busca pelo e-mail do User vinculado ao Booking
      bookings = await db.booking.findMany({
        where: {
          user: { email },
        },
        include: { passengers: true },
        orderBy: { createdAt: "desc" },
      });
    } else if (cpf) {
      // Busca pelo CPF de qualquer Passenger vinculado ao Booking
      bookings = await db.booking.findMany({
        where: {
          passengers: { some: { cpf } },
        },
        include: { passengers: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({
      data: bookings,
      error: null,
      meta: { total: bookings.length },
    });
  } catch (err) {
    console.error("[GET /api/bookings/list] Unexpected error:", err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
