import Anthropic from "@anthropic-ai/sdk";
import { BookingPayload, PassengerInfo, FraudCheckResult } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é um especialista em prevenção de fraudes em e-commerce de passagens aéreas com experiência em análise de risco de transações financeiras no Brasil. Sua função é analisar reservas de passagens e identificar padrões suspeitos antes da cobrança.

## Critérios de Análise de Risco

### Risco ALTO (approved: false)
- Valor total acima de R$ 5.000 para primeiro booking sem histórico
- Múltiplos passageiros com CPFs em sequência numérica suspeita
- Nome de passageiro genérico: "TESTE", "AAA", "XXX" ou sequências repetidas
- Bebês (INFANT) sem adulto (ADULT) correspondente na reserva
- Mais de 5 reservas no mesmo IP nas últimas 24h
- CPF com formato inválido ou dígitos todos iguais (111.111.111-11, etc.)
- Data de nascimento inconsistente com tipo do passageiro (bebê com 20 anos, adulto com 3 anos)

### Risco MÉDIO (approved: true, mas requer revisão)
- Valor entre R$ 2.000 e R$ 5.000 sem histórico de compras
- 2-5 reservas no mesmo IP recentemente
- Nome muito curto (menos de 3 caracteres em nome ou sobrenome)
- Data de nascimento que coloca o passageiro em faixa etária atípica para o tipo declarado

### Risco BAIXO (approved: true)
- Padrões normais de compra
- Dados consistentes entre si
- Histórico de compras presente

## Formato de Resposta
Responda EXCLUSIVAMENTE com JSON válido:
{
  "risk": "LOW" | "MEDIUM" | "HIGH",
  "reason": "Descrição clara e objetiva dos fatores de risco identificados ou da ausência deles",
  "approved": true | false
}

Não inclua texto fora do JSON.`;

export interface FraudInput {
  booking: BookingPayload;
  passengers: PassengerInfo[];
  ip?: string;
  userAgent?: string;
  previousBookings?: number;
}

function validateCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits[10]);
}

function buildAnalysisContext(input: FraudInput): string {
  const adults = input.passengers.filter((p) => p.type === "ADULT").length;
  const children = input.passengers.filter((p) => p.type === "CHILD").length;
  const infants = input.passengers.filter((p) => p.type === "INFANT").length;

  const cpfValidations = input.passengers.map((p) => ({
    nome: `${p.firstName} ${p.lastName}`,
    tipo: p.type,
    cpf_valido: validateCpf(p.cpf),
    data_nascimento: p.dateOfBirth,
    nome_suspeito: /^(teste|aaa|xxx|zzz|abc)/i.test(p.firstName) ||
      p.firstName.length < 2 ||
      p.lastName.length < 2,
  }));

  return JSON.stringify(
    {
      reserva: {
        valor_total: `R$ ${input.booking.totalAmount.toFixed(2)}`,
        origem: input.booking.origin,
        destino: input.booking.destination,
        partida: input.booking.departureAt,
        companhia: input.booking.airline,
        voo: input.booking.flightNumber,
        email_contato: input.booking.contactEmail,
        telefone_contato: input.booking.contactPhone,
      },
      passageiros: {
        adultos: adults,
        criancas: children,
        bebes: infants,
        bebes_sem_adulto: infants > 0 && adults === 0,
        detalhes: cpfValidations,
      },
      contexto_tecnico: {
        ip: input.ip ?? "não informado",
        user_agent: input.userAgent ?? "não informado",
        bookings_anteriores: input.previousBookings ?? 0,
        primeiro_booking: (input.previousBookings ?? 0) === 0,
      },
    },
    null,
    2
  );
}

export async function detectFraud(input: FraudInput): Promise<FraudCheckResult> {
  const context = buildAnalysisContext(input);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Analise esta reserva e determine o nível de risco de fraude:\n\n${context}`,
        },
      ],
    });

    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta sem JSON válido.");
    }

    const result = JSON.parse(jsonMatch[0]) as FraudCheckResult;

    if (!["LOW", "MEDIUM", "HIGH"].includes(result.risk)) {
      throw new Error(`Risk inválido: ${result.risk}`);
    }

    if (result.risk === "MEDIUM") {
      console.log(
        JSON.stringify({
          event: "fraud_review_needed",
          risk: result.risk,
          reason: result.reason,
          booking: input.booking.flightOfferId,
          totalAmount: input.booking.totalAmount,
          email: input.booking.contactEmail,
        })
      );
    }

    if (result.risk === "HIGH") {
      console.warn(
        JSON.stringify({
          event: "fraud_blocked",
          risk: result.risk,
          reason: result.reason,
          booking: input.booking.flightOfferId,
          totalAmount: input.booking.totalAmount,
          email: input.booking.contactEmail,
          ip: input.ip,
        })
      );
    }

    return {
      risk: result.risk,
      reason: result.reason,
      approved: result.risk !== "HIGH",
    };
  } catch (err) {
    console.error("[FraudDetection] Erro na análise:", err);

    return {
      risk: "LOW",
      reason: "Análise automática indisponível. Aprovação padrão aplicada.",
      approved: true,
    };
  }
}
