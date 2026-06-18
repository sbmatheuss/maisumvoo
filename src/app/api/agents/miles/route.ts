import { NextRequest, NextResponse } from "next/server";
import { milesAgent } from "@/lib/agents/miles-agent";
import type { ChatMessage } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages: ChatMessage[];
      bookingId?: string;
    };

    const { messages, bookingId } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { data: null, error: "Campo 'messages' é obrigatório e não pode ser vazio." },
        { status: 400 }
      );
    }

    const validRoles = new Set(["user", "assistant"]);
    const allValid = messages.every(
      (m) =>
        typeof m.content === "string" &&
        m.content.trim().length > 0 &&
        validRoles.has(m.role)
    );

    if (!allValid) {
      return NextResponse.json(
        { data: null, error: "Mensagens inválidas: verifique role e content." },
        { status: 400 }
      );
    }

    const stream = await milesAgent(messages, bookingId);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[POST /api/agents/miles]", err);
    return NextResponse.json(
      { data: null, error: "Erro interno ao processar mensagem." },
      { status: 500 }
    );
  }
}
