import { NextRequest, NextResponse } from "next/server";
import { searchAgent } from "@/lib/agents/search-agent";
import { FlightOffer, SearchParams, ApiResponse } from "@/types";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      flights: FlightOffer[];
      searchParams: SearchParams;
    };

    const { flights, searchParams } = body;

    if (!Array.isArray(flights) || flights.length === 0) {
      const response: ApiResponse<null> = {
        data: null,
        error: "Campo 'flights' é obrigatório e não pode ser vazio.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!searchParams?.origin || !searchParams?.destination) {
      const response: ApiResponse<null> = {
        data: null,
        error: "Campo 'searchParams' com origin e destination é obrigatório.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await searchAgent(flights, searchParams);

    const response: ApiResponse<typeof result> = {
      data: result,
      error: null,
      meta: {
        totalFlights: flights.length,
        rankedCount: result.rankedFlights.length,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/agents/search]", err);

    const response: ApiResponse<null> = {
      data: null,
      error: "Erro interno ao processar análise de voos.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
