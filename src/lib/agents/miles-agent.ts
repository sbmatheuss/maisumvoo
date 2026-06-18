import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import type { ChatMessage, MilesEstimate, MilesProgram } from "@/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Tabela de distâncias (km em linha reta) ──────────────────────────────
const ROUTE_DISTANCES: Record<string, number> = {
  "GRU-FLN": 630,  "GRU-GIG": 357,  "GRU-SSA": 1654, "GRU-REC": 2093,
  "GRU-FOR": 2369, "GRU-BSB": 872,  "GRU-CWB": 343,  "GRU-POA": 1097,
  "GRU-BEL": 2587, "GRU-MAO": 2690, "GRU-MCZ": 2139, "GRU-NAT": 2255,
  "GRU-CNF": 450,  "GRU-VCP": 85,   "GRU-EZE": 1780, "GRU-SCL": 2589,
  "GRU-LIM": 3647, "GRU-BOG": 4610, "GRU-MIA": 7597, "GRU-JFK": 7726,
  "GRU-LIS": 7896, "GRU-CDG": 9339, "GRU-MAD": 8919, "GRU-FRA": 9735,
  "GRU-DXB": 11403,"GRU-NRT": 18522,"GIG-SSA": 1197, "GIG-REC": 1839,
  "GIG-BSB": 1159, "GIG-FLN": 742,  "GIG-LIS": 7600, "GIG-MIA": 6872,
  "SSA-REC": 839,  "SSA-FOR": 1043, "FOR-REC": 803,  "BSB-FLN": 1232,
  "BSB-POA": 1570, "BSB-FOR": 1694, "CWB-FLN": 299,  "CWB-GIG": 845,
};

function getDistance(a: string, b: string): number | null {
  const key = `${a}-${b}`;
  const rev = `${b}-${a}`;
  return ROUTE_DISTANCES[key] ?? ROUTE_DISTANCES[rev] ?? null;
}

// ── Faixas e multiplicadores ─────────────────────────────────────────────
const DISTANCE_BANDS = [
  { maxKm: 800,      baseMiles: 8_000  },
  { maxKm: 1_800,    baseMiles: 12_000 },
  { maxKm: 3_500,    baseMiles: 18_000 },
  { maxKm: 7_000,    baseMiles: 30_000 },
  { maxKm: 12_000,   baseMiles: 50_000 },
  { maxKm: Infinity, baseMiles: 70_000 },
];

const CABIN_MULTIPLIERS: Record<string, number> = {
  ECONOMY: 1.0, PREMIUM_ECONOMY: 1.5, BUSINESS: 2.5, FIRST: 4.0,
};

const PROGRAM_MODIFIERS: Record<MilesProgram, number> = {
  LATAM_PASS: 1.0, SMILES: 0.9, AZUL_FIDELIDADE: 0.85, TUDO_AZUL: 0.95,
};

const PROGRAM_LABELS: Record<MilesProgram, string> = {
  LATAM_PASS: "LATAM Pass", SMILES: "Smiles (Gol)",
  AZUL_FIDELIDADE: "Azul Fidelidade", TUDO_AZUL: "TudoAzul",
};

// ── Executores das ferramentas ────────────────────────────────────────────
async function toolGetBookingInfo(bookingId: string): Promise<object> {
  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { passengers: true },
    });
    if (!booking) return { error: "Reserva não encontrada", bookingId };
    return {
      id: booking.id,
      status: booking.status,
      origin: booking.origin,
      destination: booking.destination,
      departureAt: booking.departureAt.toISOString(),
      arrivalAt: booking.arrivalAt.toISOString(),
      airline: booking.airline,
      flightNumber: booking.flightNumber,
      totalAmountBrl: (booking.totalAmount / 100).toFixed(2),
      currency: booking.currency,
      isMilesBooking: booking.isMilesBooking,
      milesProgram: booking.milesProgram,
      milesAmount: booking.milesAmount,
      passengerCount: booking.passengers.length,
      passengers: booking.passengers.map((p) => ({
        name: `${p.firstName} ${p.lastName}`,
        type: p.type,
      })),
      createdAt: booking.createdAt.toISOString(),
    };
  } catch (err) {
    console.error("[MilesAgent] toolGetBookingInfo:", err);
    return { error: "Erro ao buscar reserva" };
  }
}

async function toolCancelBooking(bookingId: string): Promise<object> {
  try {
    const existing = await db.booking.findUnique({ where: { id: bookingId } });
    if (!existing) return { success: false, error: "Reserva não encontrada" };
    if (existing.status === "CANCELLED") {
      return { success: false, error: "Reserva já está cancelada" };
    }
    await db.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
    console.log(
      JSON.stringify({
        event: "booking_cancelled_by_agent",
        bookingId,
        agent: "miles-agent",
        timestamp: new Date().toISOString(),
      })
    );
    return { success: true, bookingId, newStatus: "CANCELLED" };
  } catch (err) {
    console.error("[MilesAgent] toolCancelBooking:", err);
    return { success: false, error: "Erro ao cancelar reserva" };
  }
}

function toolEstimateMiles(
  origin: string,
  destination: string,
  cabinClass: string,
  program: MilesProgram
): MilesEstimate {
  const distanceKm = getDistance(
    origin.toUpperCase(),
    destination.toUpperCase()
  );

  let bandIndex = 2; // default: faixa 3 (1801-3500 km) se rota desconhecida
  let note: string | undefined;

  if (distanceKm !== null) {
    bandIndex = DISTANCE_BANDS.findIndex((b) => distanceKm <= b.maxKm);
    if (bandIndex === -1) bandIndex = DISTANCE_BANDS.length - 1;
  } else {
    note =
      "Distância exata não disponível para esta rota. Estimativa baseada em faixa média nacional.";
  }

  const band = DISTANCE_BANDS[bandIndex];
  const cabinMult = CABIN_MULTIPLIERS[cabinClass] ?? 1.0;
  const progMod = PROGRAM_MODIFIERS[program] ?? 1.0;
  const effectiveDistance = distanceKm ?? 2_500;

  const milesNeeded = Math.round(band.baseMiles * cabinMult * progMod);
  const milesEarned = Math.round(effectiveDistance * 10 * cabinMult * 0.5);

  return {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    cabinClass,
    program,
    milesNeeded,
    milesEarned,
    distanceBand: bandIndex + 1,
    distanceKm,
    programLabel: PROGRAM_LABELS[program],
    note,
  };
}

// ── Definições das ferramentas para a API Anthropic ──────────────────────
const TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "get_booking_info",
    description:
      "Busca informações completas de uma reserva pelo ID, incluindo passageiros, status, rota e valores. Use sempre que o usuário mencionar um código de reserva.",
    input_schema: {
      type: "object" as const,
      properties: {
        bookingId: {
          type: "string",
          description: "O ID único da reserva (ex: cma1b2c3d4e5f6g7h8i9j)",
        },
      },
      required: ["bookingId"],
    },
  },
  {
    name: "cancel_booking",
    description:
      "Cancela uma reserva definindo seu status como CANCELLED. Obtenha confirmação explícita do usuário antes de chamar. Não chame se a reserva já estiver cancelada.",
    input_schema: {
      type: "object" as const,
      properties: {
        bookingId: {
          type: "string",
          description: "O ID único da reserva a ser cancelada",
        },
      },
      required: ["bookingId"],
    },
  },
  {
    name: "estimate_miles",
    description:
      "Calcula estimativa de milhas necessárias para resgatar e milhas acumuladas ao comprar uma passagem, com base em rota, classe e programa. Não usa API externa.",
    input_schema: {
      type: "object" as const,
      properties: {
        origin: {
          type: "string",
          description: "Código IATA de origem (ex: GRU)",
        },
        destination: {
          type: "string",
          description: "Código IATA de destino (ex: FLN)",
        },
        cabinClass: {
          type: "string",
          enum: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
          description: "Classe de cabine",
        },
        program: {
          type: "string",
          enum: ["LATAM_PASS", "SMILES", "AZUL_FIDELIDADE", "TUDO_AZUL"],
          description: "Programa de fidelidade",
        },
      },
      required: ["origin", "destination", "cabinClass", "program"],
    },
  },
];

// ── System prompt ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é a Milha, especialista em programas de fidelidade e milhas aéreas da maisumvoo. Você tem dois papéis:

## 1. ESPECIALISTA EM MILHAS
Auxilia passageiros com programas de fidelidade brasileiros:
- **LATAM Pass** (LATAM Airlines) — vencimento 24 meses, categorias Bronze/Silver/Gold/Diamond, parceiros Itaucard e XP
- **Smiles** (Gol Linhas Aéreas) — vencimento 24 meses (prorrogável), categorias Bronze/Prata/Ouro/Diamante, parceiros Bradesco e Santander
- **Azul Fidelidade** (Azul Linhas Aéreas) — vencimento 24 meses, parceiro Itaucard
- **TudoAzul** (Azul Linhas Aéreas) — programa alternativo para acúmulo com compras

Regras importantes sobre milhas:
- Milhas não têm valor fixo em reais — variam por rota, data e disponibilidade de assentos prêmio
- Resgate vs. acúmulo são operações distintas: resgate usa milhas para emitir bilhete; acúmulo ganha milhas ao voar ou comprar
- Assentos prêmio têm disponibilidade limitada por voo — não é garantido resgatar qualquer data
- Use sempre a ferramenta estimate_miles para fornecer números precisos — nunca invente valores

## 2. ATENDENTE DE CANCELAMENTOS
Processa cancelamentos de reservas de forma conversacional e segura:
- Use get_booking_info para verificar dados antes de cancelar
- **OBRIGATÓRIO**: peça confirmação explícita antes de chamar cancel_booking ("pode confirmar que deseja cancelar?" ou similar)
- Só chame cancel_booking após o usuário confirmar com "sim", "pode cancelar", "confirmo" ou equivalente
- Reservas já canceladas (status CANCELLED) não podem ser canceladas novamente
- Informe que cancelamentos podem ter políticas de reembolso variáveis conforme companhia e tarifa

## Comportamento geral
- Responda sempre em português do Brasil
- Quando o usuário mencionar um código de reserva, chame get_booking_info imediatamente
- Para cálculos de milhas, sempre use estimate_miles com os parâmetros corretos
- Seja preciso e objetivo — evite respostas longas desnecessárias
- Se não souber o código IATA de uma cidade, peça ao usuário ou use o código mais conhecido (ex: São Paulo = GRU)`;

// ── Loop agêntico (Fase 1 — tools síncronos) ─────────────────────────────
async function runAgenticLoop(
  workingMessages: Anthropic.Messages.MessageParam[],
  systemBlocks: Anthropic.Messages.TextBlockParam[]
): Promise<Anthropic.Messages.MessageParam[]> {
  const MAX_ITERATIONS = 8;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemBlocks,
      tools: TOOLS,
      messages: workingMessages,
    });

    if (response.stop_reason === "end_turn") {
      workingMessages.push({ role: "assistant", content: response.content });
      return workingMessages;
    }

    if (response.stop_reason === "tool_use") {
      workingMessages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        let result: object;
        const input = block.input as Record<string, string>;

        if (block.name === "get_booking_info") {
          result = await toolGetBookingInfo(input.bookingId);
        } else if (block.name === "cancel_booking") {
          result = await toolCancelBooking(input.bookingId);
        } else if (block.name === "estimate_miles") {
          result = toolEstimateMiles(
            input.origin,
            input.destination,
            input.cabinClass,
            input.program as MilesProgram
          );
        } else {
          result = { error: `Ferramenta desconhecida: ${block.name}` };
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }

      workingMessages.push({ role: "user", content: toolResults });
      continue;
    }

    // stop_reason inesperado — encerra o loop
    break;
  }

  return workingMessages;
}

// ── Exportação pública ────────────────────────────────────────────────────
export async function milesAgent(
  messages: ChatMessage[],
  bookingId?: string
): Promise<ReadableStream<Uint8Array>> {
  const systemBlocks: Anthropic.Messages.TextBlockParam[] = [
    { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ];

  if (bookingId) {
    systemBlocks.push({
      type: "text",
      text: `Reserva em contexto: ID ${bookingId}. Se o usuário não mencionar outro ID, use este.`,
    });
  }

  const workingMessages: Anthropic.Messages.MessageParam[] = messages.map(
    (m) => ({ role: m.role, content: m.content })
  );

  // Fase 1: executa todas as chamadas de ferramentas de forma síncrona
  const resolved = await runAgenticLoop(workingMessages, systemBlocks);

  // Fase 2: gera a resposta final em streaming, sem re-trigger de tools
  // Remove o último turno assistente (adicionado pelo loop) para re-streamar
  const messagesForStream = resolved.slice(0, -1);

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          system: systemBlocks,
          tools: TOOLS,
          tool_choice: { type: "none" }, // garante resposta texto puro
          messages: messagesForStream,
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("[MilesAgent] Erro no stream final:", err);
        // Fallback: envia o texto já resolvido na fase 1
        const lastMsg = resolved[resolved.length - 1];
        const fallbackText = Array.isArray(lastMsg.content)
          ? lastMsg.content
              .filter(
                (b): b is Anthropic.Messages.TextBlock => b.type === "text"
              )
              .map((b) => b.text)
              .join("")
          : String(lastMsg.content);
        controller.enqueue(encoder.encode(fallbackText));
        controller.close();
      }
    },
  });
}
