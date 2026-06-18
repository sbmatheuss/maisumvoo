import { create } from "zustand";
import { FlightOffer, SearchParams, ApiResponse } from "@/types";

interface Filters {
  maxPrice: number | null;
  stops: number | null;
  airlines: string[];
}

interface FlightState {
  searchParams: SearchParams | null;
  flights: FlightOffer[];
  selectedFlight: FlightOffer | null;
  bookingId: string | null;
  filters: Filters;
  isLoading: boolean;
  error: string | null;
}

interface FlightActions {
  setSearchParams: (params: SearchParams) => void;
  setFlights: (flights: FlightOffer[]) => void;
  selectFlight: (flight: FlightOffer) => void;
  setBookingId: (id: string) => void;
  setFilters: (filters: Partial<Filters>) => void;
  fetchFlights: (params: SearchParams) => Promise<void>;
  reset: () => void;
}

const initialState: FlightState = {
  searchParams: null,
  flights: [],
  selectedFlight: null,
  bookingId: null,
  filters: {
    maxPrice: null,
    stops: null,
    airlines: [],
  },
  isLoading: false,
  error: null,
};

export const useFlightStore = create<FlightState & FlightActions>((set) => ({
  ...initialState,

  setSearchParams: (params) => set({ searchParams: params }),

  setFlights: (flights) => set({ flights }),

  selectFlight: (flight) => set({ selectedFlight: flight }),

  setBookingId: (id) => set({ bookingId: id }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  fetchFlights: async (params) => {
    set({ isLoading: true, error: null, searchParams: params });

    try {
      const query = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        adults: String(params.adults),
        children: String(params.children),
        infants: String(params.infants),
        tripType: params.tripType,
        cabinClass: params.cabinClass,
        ...(params.returnDate ? { returnDate: params.returnDate } : {}),
      });

      const res = await fetch(`/api/flights/search?${query.toString()}`);
      const json: ApiResponse<FlightOffer[]> = await res.json();

      if (!res.ok || json.error) {
        set({ error: json.error ?? "Erro ao buscar voos.", isLoading: false });
        return;
      }

      set({ flights: json.data ?? [], isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      set({ error: message, isLoading: false });
    }
  },

  reset: () => set(initialState),
}));
