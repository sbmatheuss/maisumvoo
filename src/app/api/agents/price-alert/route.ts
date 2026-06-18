import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ApiResponse } from "@/types";

export const dynamic = 'force-dynamic';

const priceAlertSchema = z.object({
  userId: z.string().min(1, "userId é obrigatório"),
  origin: z
    .string()
    .length(3, "origin deve ser um código IATA de 3 letras")
    .toUpperCase(),
  destination: z
    .string()
    .length(3, "destination deve ser um código IATA de 3 letras")
    .toUpperCase(),
  targetPrice: z
    .number()
    .positive("targetPrice deve ser um valor positivo")
    .int("targetPrice deve ser um número inteiro em centavos ou reais inteiros"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = priceAlertSchema.safeParse(body);

    if (!parsed.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: parsed.error.errors.map((e) => e.message).join("; "),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { userId, origin, destination, targetPrice } = parsed.data;

    const userExists = await db.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      const response: ApiResponse<null> = {
        data: null,
        error: "Usuário não encontrado.",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const existingAlert = await db.priceAlert.findFirst({
      where: { userId, origin, destination, isActive: true },
    });

    if (existingAlert) {
      const response: ApiResponse<null> = {
        data: null,
        error: "Já existe um alerta ativo para esta rota.",
      };
      return NextResponse.json(response, { status: 409 });
    }

    const alert = await db.priceAlert.create({
      data: { userId, origin, destination, targetPrice },
    });

    console.log(
      JSON.stringify({
        event: "price_alert_created",
        alertId: alert.id,
        userId,
        origin,
        destination,
        targetPrice,
      })
    );

    const response: ApiResponse<{ alertId: string }> = {
      data: { alertId: alert.id },
      error: null,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("[POST /api/agents/price-alert]", err);
    const response: ApiResponse<null> = {
      data: null,
      error: "Erro interno ao criar alerta de preço.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

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

    const alerts = await db.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const response: ApiResponse<typeof alerts> = {
      data: alerts,
      error: null,
      meta: { total: alerts.length },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[GET /api/agents/price-alert]", err);
    const response: ApiResponse<null> = {
      data: null,
      error: "Erro interno ao buscar alertas.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
