import Amadeus from "amadeus";
import { FlightOffer, FlightItinerary, FlightSegment, AirportSuggestion, SearchParams } from "@/types";
import { getCache, setCache } from "@/lib/redis";

let _amadeus: Amadeus | null = null;

function getAmadeus(): Amadeus {
  if (!_amadeus) {
    _amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID ?? "",
      clientSecret: process.env.AMADEUS_CLIENT_SECRET ?? "",
      hostname: process.env.AMADEUS_IS_SANDBOX === "true" ? "test" : "production",
    });
  }
  return _amadeus;
}

// Mapeamento de destino → imagem Unsplash por iataCode
const DESTINATION_IMAGES: Record<string, { image: string; city: string }> = {
  GRU: {
    image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80",
    city: "São Paulo",
  },
  GIG: {
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    city: "Rio de Janeiro",
  },
  BSB: {
    image: "https://images.unsplash.com/photo-1590749003767-9e40b3ef8e2e?w=800&q=80",
    city: "Brasília",
  },
  FOR: {
    image: "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=800&q=80",
    city: "Fortaleza",
  },
  SSA: {
    image: "https://images.unsplash.com/photo-1591958910704-d5c19ff71bac?w=800&q=80",
    city: "Salvador",
  },
  CGH: {
    image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80",
    city: "São Paulo (Congonhas)",
  },
  POA: {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    city: "Porto Alegre",
  },
  REC: {
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80",
    city: "Recife",
  },
  MCZ: {
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80",
    city: "Maceió",
  },
  NAT: {
    image: "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=800&q=80",
    city: "Natal",
  },
  BEL: {
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
    city: "Belém",
  },
  SDU: {
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    city: "Rio de Janeiro (Santos Dumont)",
  },
  CNF: {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    city: "Belo Horizonte",
  },
  CWB: {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    city: "Curitiba",
  },
  FLN: {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    city: "Florianópolis",
  },
  VCP: {
    image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80",
    city: "Campinas",
  },
};

const DEFAULT_FLIGHT_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80";

function mapSegment(seg: any): FlightSegment {
  return {
    departure: {
      iataCode: seg.departure?.iataCode ?? "",
      city: seg.departure?.iataCode ?? "",
      at: seg.departure?.at ?? "",
    },
    arrival: {
      iataCode: seg.arrival?.iataCode ?? "",
      city: seg.arrival?.iataCode ?? "",
      at: seg.arrival?.at ?? "",
    },
    carrierCode: seg.carrierCode ?? "",
    number: seg.number ?? "",
    duration: seg.duration ?? "",
    aircraft: seg.aircraft?.code ?? "",
  };
}

function mapItinerary(itin: any): FlightItinerary {
  return {
    duration: itin.duration ?? "",
    segments: (itin.segments ?? []).map(mapSegment),
  };
}

function mapFlightOffer(raw: any, index: number): FlightOffer {
  const itineraries: FlightItinerary[] = (raw.itineraries ?? []).map(mapItinerary);

  const lastItinerary = itineraries[itineraries.length - 1];
  const lastSegment = lastItinerary?.segments[lastItinerary.segments.length - 1];
  const destinationCode = lastSegment?.arrival?.iataCode ?? "";

  const destinationData = DESTINATION_IMAGES[destinationCode];

  const totalSegments = itineraries.reduce(
    (acc: number, itin: FlightItinerary) => acc + itin.segments.length,
    0
  );
  const stops = Math.max(0, totalSegments - itineraries.length);

  const totalPrice = raw.price?.grandTotal ?? raw.price?.total ?? "0";
  const basePrice = raw.price?.base ?? "0";
  const currency = raw.price?.currency ?? "BRL";

  const adults = raw.travelerPricings?.filter(
    (tp: any) => tp.travelerType === "ADULT"
  ).length ?? 1;

  const perAdult = adults > 0
    ? (parseFloat(totalPrice) / adults).toFixed(2)
    : totalPrice;

  const seatsAvailable =
    raw.numberOfBookableSeats ?? raw.seatsAvailable ?? 9;

  return {
    id: `offer-${index}-${raw.id ?? index}`,
    amadeus_offerId: raw.id ?? "",
    itineraries,
    price: {
      total: totalPrice,
      base: basePrice,
      currency,
      perAdult: String(perAdult),
    },
    validatingAirlineCodes: raw.validatingAirlineCodes ?? [],
    seatsAvailable,
    stops,
    destinationImage: destinationData?.image ?? DEFAULT_FLIGHT_IMAGE,
    destinationCity: destinationData?.city ?? destinationCode,
  };
}

function generateMockFlights(params: SearchParams): FlightOffer[] {
  const airlines = [
    { code: "LA", name: "LATAM" },
    { code: "G3", name: "Gol" },
    { code: "AD", name: "Azul" },
  ];

  const dep = new Date(`${params.departureDate}T06:00:00`);

  return airlines.flatMap((airline, ai) =>
    [0, 1].map((variant) => {
      const departureHour = 6 + ai * 4 + variant * 2;
      const durationH = 1 + Math.floor(Math.random() * 3);
      const durationM = Math.floor(Math.random() * 60);
      const depTime = new Date(`${params.departureDate}T${String(departureHour).padStart(2, "0")}:${String(variant * 30).padStart(2, "0")}:00`);
      const arrTime = new Date(depTime.getTime() + (durationH * 60 + durationM) * 60_000);
      const basePrice = 350 + ai * 120 + variant * 80 + Math.floor(Math.random() * 200);
      const totalPrice = (basePrice * params.adults).toFixed(2);
      const stops = variant === 1 && ai === 2 ? 1 : 0;

      const segments = stops === 0
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

      const idx = ai * 2 + variant;
      const destData = DESTINATION_IMAGES[params.destination];

      return {
        id: `mock-offer-${idx}`,
        amadeus_offerId: `mock-${idx}`,
        itineraries: [{ duration: `PT${durationH}H${durationM}M`, segments }],
        price: {
          total: totalPrice,
          base: String(basePrice),
          currency: "BRL",
          perAdult: String(basePrice),
        },
        validatingAirlineCodes: [airline.code],
        seatsAvailable: 9 - ai - variant,
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
  if (cached) {
    console.log(`[Amadeus] Cache hit for ${cacheKey}`);
    return cached;
  }

  try {
    const searchParams: Record<string, string | number> = {
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.adults,
      travelClass: params.cabinClass,
      max: 20,
      currencyCode: "BRL",
    };

    if (params.children > 0) searchParams.children = params.children;
    if (params.infants > 0) searchParams.infants = params.infants;
    if (params.returnDate) searchParams.returnDate = params.returnDate;

    const response = await getAmadeus().shopping.flightOffersSearch.get(searchParams);
    const offers: FlightOffer[] = (response.data ?? []).map(mapFlightOffer);

    if (offers.length > 0) {
      await setCache(cacheKey, offers, 300);
      return offers;
    }
  } catch (err) {
    console.error("[Amadeus] searchFlights error:", err);
  }

  // Fallback: voos mock para desenvolvimento/demo
  console.warn("[Amadeus] Usando voos mock (configure AMADEUS_CLIENT_ID para dados reais)");
  return generateMockFlights(params);
}

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
  { iataCode: "EZE", name: "Aeroporto Internacional Ministro Pistarini", city: "Buenos Aires", country: "Argentina" },
  { iataCode: "SCL", name: "Aeroporto Internacional Arturo Merino Benítez", city: "Santiago", country: "Chile" },
  { iataCode: "GRU", name: "Aeroporto Internacional de Guarulhos", city: "São Paulo", country: "Brasil" },
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
  if (cached) {
    console.log(`[Amadeus] Cache hit for ${cacheKey}`);
    return cached;
  }

  try {
    const response = await getAmadeus().referenceData.locations.get({
      keyword: query,
      subType: "AIRPORT,CITY",
    });

    const suggestions: AirportSuggestion[] = (response.data ?? []).slice(0, 8).map((loc: any) => ({
      iataCode: loc.iataCode ?? loc.id ?? "",
      name: loc.name ?? "",
      city: loc.address?.cityName ?? loc.name ?? "",
      country: loc.address?.countryName ?? "",
    }));

    if (suggestions.length > 0) {
      await setCache(cacheKey, suggestions, 3600);
      return suggestions;
    }
  } catch (err) {
    console.error("[Amadeus] searchAirports error:", err);
  }

  // Fallback: filtro na lista estática
  const q = query.toLowerCase();
  return STATIC_AIRPORTS.filter(
    (a) =>
      a.iataCode.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}

export default getAmadeus;
