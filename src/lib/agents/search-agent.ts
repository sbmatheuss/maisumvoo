import Anthropic from "@anthropic-ai/sdk";
import { FlightOffer, SearchParams } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é um especialista em viagens aéreas com mais de 20 anos de experiência analisando tarifas e rotas. Sua função é analisar ofertas de voos e ajudar passageiros a encontrar a melhor opção de custo-benefício.

Ao analisar voos, você considera:
- Preço total e preço por adulto
- Duração total do voo e conexões
- Número de paradas e tempo de escalas
- Companhia aérea e sua reputação
- Disponibilidade de assentos (urgência)
- Horários convenientes de partida e chegada
- Classe de cabine e conforto

Sua análise deve ser objetiva, clara e em português do Brasil. Sempre justifique suas recomendações com dados concretos das ofertas disponíveis.

Formato de resposta esperado (JSON):
{
  "rankedIds": ["id1", "id2", "id3"],
  "bestPickId": "id1",
  "analysis": "Texto explicativo detalhado sobre as ofertas analisadas, destacando a melhor opção e por quê, e comparando alternativas como voos diretos vs com escala."
}`;

function formatFlightsForPrompt(flights: FlightOffer[], params: SearchParams): string {
  const flightSummaries = flights.map((f) => {
    const itinerary = f.itineraries[0];
    const firstSeg = itinerary?.segments[0];
    const lastSeg = itinerary?.segments[itinerary.segments.length - 1];

    return {
      id: f.id,
      preco_total: `${f.price.currency} ${f.price.total}`,
      preco_por_adulto: `${f.price.currency} ${f.price.perAdult}`,
      duracao: itinerary?.duration ?? "N/A",
      paradas: f.stops,
      companhia: f.validatingAirlineCodes.join(", "),
      partida: firstSeg?.departure?.at ?? "N/A",
      chegada: lastSeg?.arrival?.at ?? "N/A",
      assentos_disponiveis: f.seatsAvailable,
      segmentos: itinerary?.segments.map((s) => ({
        voo: `${s.carrierCode}${s.number}`,
        de: s.departure.iataCode,
        para: s.arrival.iataCode,
        duracao: s.duration,
      })),
    };
  });

  return JSON.stringify({
    busca: {
      origem: params.origin,
      destino: params.destination,
      data_ida: params.departureDate,
      data_volta: params.returnDate ?? null,
      adultos: params.adults,
      criancas: params.children,
      bebes: params.infants,
      classe: params.cabinClass,
      tipo_viagem: params.tripType,
    },
    ofertas: flightSummaries,
  }, null, 2);
}

export async function searchAgent(
  flights: FlightOffer[],
  searchParams: SearchParams
): Promise<{
  rankedFlights: FlightOffer[];
  bestPick: FlightOffer;
  analysis: string;
}> {
  if (flights.length === 0) {
    throw new Error("Nenhuma oferta de voo disponível para análise.");
  }

  if (flights.length === 1) {
    return {
      rankedFlights: flights,
      bestPick: flights[0],
      analysis: "Apenas uma oferta disponível para esta rota e data.",
    };
  }

  const userMessage = `Analise as seguintes ofertas de voo e retorne sua avaliação no formato JSON especificado:\n\n${formatFlightsForPrompt(flights, searchParams)}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta do Claude não contém JSON válido.");
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      rankedIds: string[];
      bestPickId: string;
      analysis: string;
    };

    const flightMap = new Map(flights.map((f) => [f.id, f]));

    const rankedFlights = parsed.rankedIds
      .map((id) => flightMap.get(id))
      .filter((f): f is FlightOffer => f !== undefined);

    const remaining = flights.filter(
      (f) => !parsed.rankedIds.includes(f.id)
    );
    const allRanked = [...rankedFlights, ...remaining];

    const bestPick =
      flightMap.get(parsed.bestPickId) ?? allRanked[0];

    return {
      rankedFlights: allRanked,
      bestPick,
      analysis: parsed.analysis,
    };
  } catch (err) {
    console.error("[SearchAgent] Erro ao processar resposta do Claude:", err);

    const sorted = [...flights].sort(
      (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total)
    );

    return {
      rankedFlights: sorted,
      bestPick: sorted[0],
      analysis:
        "Voos ordenados por preço. Análise inteligente indisponível no momento.",
    };
  }
}
