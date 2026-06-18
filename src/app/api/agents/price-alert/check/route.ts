import { NextResponse } from "next/server";
import { checkPriceAlerts } from "@/lib/agents/price-monitor-agent";
import { ApiResponse } from "@/types";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const before = await import("@/lib/db").then(({ db }) =>
      db.priceAlert.count({ where: { isActive: true } })
    );

    await checkPriceAlerts();

    const response: ApiResponse<{ checked: number }> = {
      data: { checked: before },
      error: null,
      meta: { triggeredAt: new Date().toISOString() },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/agents/price-alert/check]", err);
    const response: ApiResponse<null> = {
      data: null,
      error: "Erro ao executar verificação de alertas.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
