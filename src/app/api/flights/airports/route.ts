import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchAirports } from "@/lib/amadeus";
import type { ApiResponse, AirportSuggestion } from "@/types";

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  q: z
    .string()
    .min(2, "A busca deve ter pelo menos 2 caracteres")
    .max(100, "A busca deve ter no máximo 100 caracteres"),
});

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AirportSuggestion[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = { q: searchParams.get("q") ?? "" };

    const parsed = querySchema.safeParse(rawQuery);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors
        .map((e) => e.message)
        .join("; ");

      return NextResponse.json(
        { data: null, error: errorMessage },
        { status: 400 }
      );
    }

    const airports = await searchAirports(parsed.data.q);

    return NextResponse.json({
      data: airports,
      error: null,
      meta: { total: airports.length },
    });
  } catch (err) {
    console.error("[GET /api/flights/airports] Unexpected error:", err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
