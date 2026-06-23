import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  bookingId: z.string().min(1, "bookingId é obrigatório"),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ bookingId: string }>>> {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join("; ") },
        { status: 400 }
      );
    }

    const { bookingId } = parsed.data;

    const booking = await db.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return NextResponse.json(
        { data: null, error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { data: null, error: "Reserva cancelada" },
        { status: 409 }
      );
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });

    return NextResponse.json({ data: { bookingId }, error: null });
  } catch (err) {
    console.error("[POST /api/payments/simulate] Unexpected error:", err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
