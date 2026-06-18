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

    await setCache(cacheKey, offers, 300);

    return offers;
  } catch (err) {
    console.error("[Amadeus] searchFlights error:", err);
    return [];
  }
}

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

    await setCache(cacheKey, suggestions, 3600);

    return suggestions;
  } catch (err) {
    console.error("[Amadeus] searchAirports error:", err);
    return [];
  }
}

export default getAmadeus;
