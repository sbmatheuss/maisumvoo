import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchFlights } from "@/lib/amadeus";
import type { ApiResponse, FlightOffer } from "@/types";

export const dynamic = 'force-dynamic';

const searchSchema = z.object({
  origin: z
    .string()
    .length(3, "Código IATA de origem deve ter 3 caracteres")
    .toUpperCase(),
  destination: z
    .string()
    .length(3, "Código IATA de destino deve ter 3 caracteres")
    .toUpperCase(),
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de partida deve estar no formato YYYY-MM-DD"),
  returnDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de retorno deve estar no formato YYYY-MM-DD")
    .optional(),
  adults: z.coerce.number().int().min(1).max(9).default(1),
  children: z.coerce.number().int().min(0).max(9).default(0),
  infants: z.coerce.number().int().min(0).max(4).default(0),
  cabinClass: z
    .enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"])
    .default("ECONOMY"),
});

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<FlightOffer[]>>> {
  try {
    const { searchParams } = new URL(request.url);

    const rawParams = {
      origin: searchParams.get("origin") ?? "",
      destination: searchParams.get("destination") ?? "",
      departureDate: searchParams.get("departureDate") ?? "",
      returnDate: searchParams.get("returnDate") ?? undefined,
      adults: searchParams.get("adults") ?? "1",
      children: searchParams.get("children") ?? "0",
      infants: searchParams.get("infants") ?? "0",
      cabinClass: searchParams.get("cabinClass") ?? "ECONOMY",
    };

    const parsed = searchSchema.safeParse(rawParams);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");

      return NextResponse.json(
        { data: null, error: `Parâmetros inválidos: ${errorMessage}` },
        { status: 400 }
      );
    }

    const params = {
      ...parsed.data,
      tripType: parsed.data.returnDate ? ("roundtrip" as const) : ("oneway" as const),
    };

    const flights = await searchFlights(params);

    return NextResponse.json({
      data: flights,
      error: null,
      meta: { total: flights.length },
    });
  } catch (err) {
    console.error("[GET /api/flights/search] Unexpected error:", err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
