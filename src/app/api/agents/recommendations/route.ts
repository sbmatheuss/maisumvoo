import { NextRequest, NextResponse } from "next/server";
import { recommendationAgent } from "@/lib/agents/recommendation-agent";
import { db } from "@/lib/db";
import { ApiResponse, RecommendedDestination } from "@/types";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || userId.trim().length === 0) {
      const response: ApiResponse<null> = {
        data: null,
        error: "Parâmetro 'userId' é obrigatório.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const searchHistory = await db.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        origin: true,
        destination: true,
        departureAt: true,
      },
    });

    const historyForAgent = searchHistory.map((h) => ({
      origin: h.origin,
      destination: h.destination,
      date: h.departureAt.toISOString().split("T")[0],
    }));

    const recommendations = await recommendationAgent(userId, historyForAgent);

    const response: ApiResponse<RecommendedDestination[]> = {
      data: recommendations,
      error: null,
      meta: {
        userId,
        historyCount: historyForAgent.length,
        recommendationsCount: recommendations.length,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[GET /api/agents/recommendations]", err);

    const response: ApiResponse<null> = {
      data: null,
      error: "Erro interno ao buscar recomendações.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
