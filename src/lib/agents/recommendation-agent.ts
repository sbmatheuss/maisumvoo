import Anthropic from "@anthropic-ai/sdk";
import { RecommendedDestination } from "@/types";
import { getCache, setCache } from "@/lib/redis";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CACHE_TTL = 1800;

const SYSTEM_PROMPT = `Você é um especialista em turismo brasileiro e internacional com profundo conhecimento sobre destinos, temporadas, preços e experiências de viagem. Sua missão é recomendar destinos personalizados com base no histórico de buscas do usuário.

Ao fazer recomendações:
- Analise padrões geográficos (destinos preferidos, regiões visitadas)
- Considere a época do ano atual para sugerir destinos na temporada ideal
- Baseie estimativas de preço no histórico observado
- Recomende de 3 a 5 destinos distintos e variados
- Para histórico vazio, sugira destinos populares e acessíveis do Brasil

Responda EXCLUSIVAMENTE com um array JSON no formato:
[
  {
    "iataCode": "FLN",
    "city": "Florianópolis",
    "country": "Brasil",
    "reason": "Justificativa personalizada e específica",
    "estimatedPrice": 450,
    "imageUrl": "https://images.unsplash.com/..."
  }
]

Não inclua texto fora do JSON. Use preços realistas em BRL (valores inteiros).`;

const POPULAR_DESTINATIONS_PROMPT = `O usuário ainda não possui histórico de buscas. Recomende os destinos mais populares e queridos do Brasil para viajantes de primeira viagem, considerando que hoje é ${new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}.

Inclua diversidade de experiências: praia, serra, cidade histórica e metrópole cultural. Sugira 5 destinos.`;

const DESTINATION_IMAGES: Record<string, string> = {
  FLN: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  GRU: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80",
  GIG: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
  REC: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80",
  FOR: "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=800&q=80",
  SSA: "https://images.unsplash.com/photo-1591958910704-d5c19ff71bac?w=800&q=80",
  NAT: "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=800&q=80",
  MCZ: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  POA: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  CWB: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  BSB: "https://images.unsplash.com/photo-1590749003767-9e40b3ef8e2e?w=800&q=80",
  BEL: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
  CNF: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  MAO: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
  VIX: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  GRV: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  LIS: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
  CDG: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  BCN: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
  MIA: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&q=80",
  DEFAULT: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
};

type SearchHistoryEntry = {
  origin: string;
  destination: string;
  date: string;
};

function buildHistoryPrompt(history: SearchHistoryEntry[]): string {
  const summaries = history
    .slice(-20)
    .map(
      (h, i) =>
        `${i + 1}. ${h.origin} → ${h.destination} (${h.date})`
    )
    .join("\n");

  return `Com base no histórico de buscas deste usuário, recomende destinos personalizados:

Histórico de buscas (mais recentes por último):
${summaries}

Identifique padrões (destinos preferidos, regiões, frequência) e recomende 3 a 5 destinos que o usuário provavelmente vai adorar, explicando a razão de cada recomendação de forma personalizada.`;
}

function ensureImageUrls(destinations: RecommendedDestination[]): RecommendedDestination[] {
  return destinations.map((d) => ({
    ...d,
    imageUrl:
      d.imageUrl && d.imageUrl.startsWith("https://")
        ? d.imageUrl
        : DESTINATION_IMAGES[d.iataCode] ?? DESTINATION_IMAGES.DEFAULT,
  }));
}

export async function recommendationAgent(
  userId: string,
  searchHistory: SearchHistoryEntry[]
): Promise<RecommendedDestination[]> {
  const cacheKey = `recommendations:${userId}`;

  const cached = await getCache<RecommendedDestination[]>(cacheKey);
  if (cached) {
    console.log(`[RecommendationAgent] Cache hit para userId=${userId}`);
    return cached;
  }

  const hasHistory = searchHistory.length > 0;
  const userMessage = hasHistory
    ? buildHistoryPrompt(searchHistory)
    : POPULAR_DESTINATIONS_PROMPT;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
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

    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Resposta sem JSON válido.");
    }

    const parsed = JSON.parse(jsonMatch[0]) as RecommendedDestination[];
    const withImages = ensureImageUrls(parsed);

    await setCache(cacheKey, withImages, CACHE_TTL);

    console.log(
      `[RecommendationAgent] ${withImages.length} destinos recomendados para userId=${userId}`
    );

    return withImages;
  } catch (err) {
    console.error("[RecommendationAgent] Erro:", err);

    const fallback: RecommendedDestination[] = [
      {
        iataCode: "FLN",
        city: "Florianópolis",
        country: "Brasil",
        reason: "Destino favorito dos brasileiros com praias paradisíacas e ótima infraestrutura.",
        estimatedPrice: 450,
        imageUrl: DESTINATION_IMAGES.FLN,
      },
      {
        iataCode: "GIG",
        city: "Rio de Janeiro",
        country: "Brasil",
        reason: "A Cidade Maravilhosa com Cristo Redentor, Copacabana e gastronomia incomparável.",
        estimatedPrice: 380,
        imageUrl: DESTINATION_IMAGES.GIG,
      },
      {
        iataCode: "REC",
        city: "Recife",
        country: "Brasil",
        reason: "Porto de Galinhas e praias de água morna a poucos quilômetros da capital.",
        estimatedPrice: 520,
        imageUrl: DESTINATION_IMAGES.REC,
      },
    ];

    return fallback;
  }
}
