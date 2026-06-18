import { NextRequest, NextResponse } from "next/server";
import { chatAgent } from "@/lib/agents/chat-agent";
import { ChatMessage } from "@/types";

export const dynamic = 'force-dynamic';

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
        { data: null, error: "Mensagens inválidas. Cada mensagem deve ter 'role' (user|assistant) e 'content' não vazio." },
        { status: 400 }
      );
    }

    const stream = await chatAgent(messages, bookingId);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[POST /api/agents/chat]", err);
    return NextResponse.json(
      { data: null, error: "Erro interno ao processar mensagem." },
      { status: 500 }
    );
  }
}
