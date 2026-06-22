export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  tripType: "oneway" | "roundtrip" | "multicity";
  cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    city: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    city: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  duration: string;
  aircraft: string;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightOffer {
  id: string;
  amadeus_offerId: string;
  itineraries: FlightItinerary[];
  price: {
    total: string;
    base: string;
    currency: string;
    perAdult: string;
  };
  validatingAirlineCodes: string[];
  seatsAvailable: number;
  stops: number;
  destinationImage?: string;
  destinationCity?: string;
}

export interface BookingPayload {
  flightOfferId: string;
  amadeus_offerId: string;
  passengers: PassengerInfo[];
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  airline: string;
  flightNumber: string;
  isMilesBooking?: boolean;
  milesProgram?: MilesProgram;
  milesAmount?: number;
}

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  cpf: string;
  dateOfBirth: string;
  type: "ADULT" | "CHILD" | "INFANT";
  seatNumber?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta?: Record<string, unknown>;
}

export interface AirportSuggestion {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FraudCheckResult {
  risk: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
  approved: boolean;
}

export interface RecommendedDestination {
  iataCode: string;
  city: string;
  country: string;
  reason: string;
  estimatedPrice: number;
  imageUrl: string;
}

export interface PriceAlertPayload {
  userId: string;
  origin: string;
  destination: string;
  targetPrice: number;
}

export type MilesProgram =
  | "LATAM_PASS"
  | "SMILES"
  | "AZUL_FIDELIDADE"
  | "TUDO_AZUL";

export type ContactSubjectValue =
  | "reserva"
  | "cancelamento"
  | "reembolso"
  | "bagagem"
  | "checkin"
  | "conta"
  | "pagamento"
  | "outro";

export interface ContactFormValues {
  name: string;
  email: string;
  cpfOrReservation?: string;
  subject: ContactSubjectValue;
  message: string;
}

export interface MilesEstimate {
  origin: string;
  destination: string;
  cabinClass: string;
  program: MilesProgram;
  milesNeeded: number;
  milesEarned: number;
  distanceBand: number;
  distanceKm: number | null;
  programLabel: string;
  note?: string;
}
