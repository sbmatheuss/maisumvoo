import { FlightOffer, FlightItinerary, FlightSegment, AirportSuggestion, SearchParams } from "@/types";
import { getCache, setCache } from "@/lib/redis";

// ─── Mapeamento de destinos ───────────────────────────────────────────────────

const DESTINATION_IMAGES: Record<string, { image: string; city: string }> = {
  GRU: { image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80", city: "São Paulo" },
  GIG: { image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80", city: "Rio de Janeiro" },
  BSB: { image: "https://images.unsplash.com/photo-1590749003767-9e40b3ef8e2e?w=800&q=80", city: "Brasília" },
  FOR: { image: "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=800&q=80", city: "Fortaleza" },
  SSA: { image: "https://images.unsplash.com/photo-1591958910704-d5c19ff71bac?w=800&q=80", city: "Salvador" },
  CGH: { image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80", city: "São Paulo (Congonhas)" },
  POA: { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", city: "Porto Alegre" },
  REC: { image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80", city: "Recife" },
  MCZ: { image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80", city: "Maceió" },
  NAT: { image: "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=800&q=80", city: "Natal" },
  BEL: { image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80", city: "Belém" },
  SDU: { image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80", city: "Rio de Janeiro (Santos Dumont)" },
  CNF: { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", city: "Belo Horizonte" },
  CWB: { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", city: "Curitiba" },
  FLN: { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", city: "Florianópolis" },
  VCP: { image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80", city: "Campinas" },
};

const DEFAULT_FLIGHT_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80";

// ─── Aeroportos estáticos ─────────────────────────────────────────────────────

const STATIC_AIRPORTS: AirportSuggestion[] = [
  { iataCode: "GRU", name: "Aeroporto Internacional de Guarulhos", city: "São Paulo", country: "Brasil" },
  { iataCode: "CGH", name: "Aeroporto de Congonhas", city: "São Paulo", country: "Brasil" },
  { iataCode: "VCP", name: "Aeroporto Internacional de Viracopos", city: "Campinas", country: "Brasil" },
  { iataCode: "GIG", name: "Aeroporto Internacional do Galeão", city: "Rio de Janeiro", country: "Brasil" },
  { iataCode: "SDU", name: "Aeroporto Santos Dumont", city: "Rio de Janeiro", country: "Brasil" },
  { iataCode: "BSB", name: "Aeroporto Internacional de Brasília", city: "Brasília", country: "Brasil" },
  { iataCode: "SSA", name: "Aeroporto Internacional de Salvador", city: "Salvador", country: "Brasil" },
  { iataCode: "FOR", name: "Aeroporto Internacional Pinto Martins", city: "Fortaleza", country: "Brasil" },
  { iataCode: "REC", name: "Aeroporto Internacional do Recife", city: "Recife", country: "Brasil" },
  { iataCode: "POA", name: "Aeroporto Internacional Salgado Filho", city: "Porto Alegre", country: "Brasil" },
  { iataCode: "CWB", name: "Aeroporto Internacional Afonso Pena", city: "Curitiba", country: "Brasil" },
  { iataCode: "FLN", name: "Aeroporto Internacional Hercílio Luz", city: "Florianópolis", country: "Brasil" },
  { iataCode: "CNF", name: "Aeroporto Internacional de Confins", city: "Belo Horizonte", country: "Brasil" },
  { iataCode: "NAT", name: "Aeroporto Internacional de Natal", city: "Natal", country: "Brasil" },
  { iataCode: "MCZ", name: "Aeroporto Internacional Zumbi dos Palmares", city: "Maceió", country: "Brasil" },
  { iataCode: "BEL", name: "Aeroporto Internacional Val-de-Cans", city: "Belém", country: "Brasil" },
  { iataCode: "MAO", name: "Aeroporto Internacional Eduardo Gomes", city: "Manaus", country: "Brasil" },
  { iataCode: "VIT", name: "Aeroporto Eurico de Aguiar Salles", city: "Vitória", country: "Brasil" },
  { iataCode: "THE", name: "Aeroporto Internacional de Teresina", city: "Teresina", country: "Brasil" },
  { iataCode: "JPA", name: "Aeroporto Internacional Presidente Castro Pinto", city: "João Pessoa", country: "Brasil" },
  { iataCode: "EZE", name: "Aeroporto Internacional Ministro Pistarini", city: "Buenos Aires", country: "Argentina" },
  { iataCode: "SCL", name: "Aeroporto Internacional Arturo Merino Benítez", city: "Santiago", country: "Chile" },
  { iataCode: "LIM", name: "Aeroporto Internacional Jorge Chávez", city: "Lima", country: "Peru" },
  { iataCode: "BOG", name: "Aeroporto Internacional El Dorado", city: "Bogotá", country: "Colômbia" },
  { iataCode: "MIA", name: "Aeroporto Internacional de Miami", city: "Miami", country: "EUA" },
  { iataCode: "JFK", name: "Aeroporto Internacional John F. Kennedy", city: "Nova York", country: "EUA" },
  { iataCode: "LHR", name: "Aeroporto Internacional de Heathrow", city: "Londres", country: "Reino Unido" },
  { iataCode: "CDG", name: "Aeroporto Charles de Gaulle", city: "Paris", country: "França" },
  { iataCode: "MAD", name: "Aeroporto Internacional de Barajas", city: "Madrid", country: "Espanha" },
  { iataCode: "LIS", name: "Aeroporto Internacional Humberto Delgado", city: "Lisboa", country: "Portugal" },
];

export async function searchAirports(query: string): Promise<AirportSuggestion[]> {
  const cacheKey = `airports:${query.toLowerCase().trim()}`;

  const cached = await getCache<AirportSuggestion[]>(cacheKey);
  if (cached) return cached;

  const q = query.toLowerCase();
  const results = STATIC_AIRPORTS.filter(
    (a) =>
      a.iataCode.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);

  await setCache(cacheKey, results, 86400);
  return results;
}

// ─── Geração de voos mock ─────────────────────────────────────────────────────

const AIRLINES = [
  { code: "LA", name: "LATAM" },
  { code: "G3", name: "Gol" },
  { code: "AD", name: "Azul" },
];

function generateMockFlights(params: SearchParams): FlightOffer[] {
  const destData = DESTINATION_IMAGES[params.destination];

  return AIRLINES.flatMap((airline, ai) =>
    [0, 1].map((variant) => {
      const departureHour = 6 + ai * 4 + variant * 2;
      const durationH = 1 + ai + variant;
      const durationM = variant * 25;
      const depTime = new Date(
        `${params.departureDate}T${String(departureHour).padStart(2, "0")}:${String(variant * 30).padStart(2, "0")}:00`
      );
      const arrTime = new Date(depTime.getTime() + (durationH * 60 + durationM) * 60_000);
      const basePrice = 320 + ai * 110 + variant * 75 + Math.floor(Math.random() * 150);
      const totalPrice = (basePrice * params.adults).toFixed(2);
      const stops = ai === 2 && variant === 1 ? 1 : 0;

      const segments: FlightSegment[] = stops === 0
        ? [{
            departure: { iataCode: params.origin, city: params.origin, at: depTime.toISOString() },
            arrival: { iataCode: params.destination, city: params.destination, at: arrTime.toISOString() },
            carrierCode: airline.code,
            number: `${100 + ai * 10 + variant}`,
            duration: `PT${durationH}H${durationM}M`,
            aircraft: "320",
          }]
        : [
            {
              departure: { iataCode: params.origin, city: params.origin, at: depTime.toISOString() },
              arrival: { iataCode: "GRU", city: "São Paulo", at: new Date(depTime.getTime() + 90 * 60_000).toISOString() },
              carrierCode: airline.code,
              number: `${100 + ai * 10 + variant}`,
              duration: "PT1H30M",
              aircraft: "320",
            },
            {
              departure: { iataCode: "GRU", city: "São Paulo", at: new Date(depTime.getTime() + 150 * 60_000).toISOString() },
              arrival: { iataCode: params.destination, city: params.destination, at: arrTime.toISOString() },
              carrierCode: airline.code,
              number: `${200 + ai * 10 + variant}`,
              duration: `PT${durationH}H${durationM}M`,
              aircraft: "320",
            },
          ];

      const itinerary: FlightItinerary = { duration: `PT${durationH}H${durationM}M`, segments };
      const idx = ai * 2 + variant;

      return {
        id: `mock-offer-${idx}-${params.origin}-${params.destination}`,
        amadeus_offerId: `mock-${idx}`,
        itineraries: [itinerary],
        price: {
          total: totalPrice,
          base: String(basePrice),
          currency: "BRL",
          perAdult: String(basePrice),
        },
        validatingAirlineCodes: [airline.code],
        seatsAvailable: Math.max(1, 9 - ai - variant),
        stops,
        destinationImage: destData?.image ?? DEFAULT_FLIGHT_IMAGE,
        destinationCity: destData?.city ?? params.destination,
      } satisfies FlightOffer;
    })
  );
}

export async function searchFlights(params: SearchParams): Promise<FlightOffer[]> {
  const cacheKey = `flight:${params.origin}:${params.destination}:${params.departureDate}:${params.adults}`;

  const cached = await getCache<FlightOffer[]>(cacheKey);
  if (cached) return cached;

  const offers = generateMockFlights(params);
  await setCache(cacheKey, offers, 300);
  return offers;
}
