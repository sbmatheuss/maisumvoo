"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { useFlightStore } from "@/store/useFlightStore";
import { SearchParams, FlightOffer } from "@/types";
import { formatDate } from "@/lib/utils";
import FlightFilters, {
  FlightFiltersState,
} from "@/components/flights/FlightFilters";
import FlightList from "@/components/flights/FlightList";

function getHourSlot(
  isoDateTime: string
): "morning" | "afternoon" | "night" {
  const hour = new Date(isoDateTime).getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

function parseDurationMinutes(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return 0;
  return parseInt(m[1] ?? "0") * 60 + parseInt(m[2] ?? "0");
}

function VoosPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { flights, isLoading, error, fetchFlights, selectFlight } =
    useFlightStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterState, setFilterState] = useState<FlightFiltersState>({
    priceRange: [0, 99999],
    airlines: [],
    stops: [],
    departureTime: [],
  });

  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";
  const departureDate = searchParams.get("departureDate") ?? "";
  const returnDate = searchParams.get("returnDate") ?? undefined;
  const adults = Number(searchParams.get("adults") ?? 1);
  const children = Number(searchParams.get("children") ?? 0);
  const infants = Number(searchParams.get("infants") ?? 0);
  const tripType =
    (searchParams.get("tripType") as SearchParams["tripType"]) ?? "oneway";
  const cabinClass =
    (searchParams.get("cabinClass") as SearchParams["cabinClass"]) ??
    "ECONOMY";

  useEffect(() => {
    if (!origin || !destination || !departureDate) return;
    fetchFlights({
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      tripType,
      cabinClass,
    });
  }, [
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    tripType,
    cabinClass,
    fetchFlights,
  ]);

  const maxPrice = useMemo(() => {
    if (!flights.length) return 10000;
    return Math.ceil(Math.max(...flights.map((f) => parseFloat(f.price.total))));
  }, [flights]);

  const availableAirlines = useMemo(
    () =>
      Array.from(
        new Set(flights.flatMap((f) => f.validatingAirlineCodes))
      ).sort(),
    [flights]
  );

  const filtered = useMemo<FlightOffer[]>(() => {
    return flights.filter((f) => {
      if (parseFloat(f.price.total) > filterState.priceRange[1]) return false;

      if (filterState.stops.length > 0) {
        const stopMatch =
          (filterState.stops.includes("direct") && f.stops === 0) ||
          (filterState.stops.includes("one") && f.stops === 1) ||
          (filterState.stops.includes("two_plus") && f.stops >= 2);
        if (!stopMatch) return false;
      }

      if (filterState.airlines.length > 0) {
        const hasAirline = f.validatingAirlineCodes.some((c) =>
          filterState.airlines.includes(c)
        );
        if (!hasAirline) return false;
      }

      if (filterState.departureTime.length > 0) {
        const seg = f.itineraries[0]?.segments[0];
        if (seg) {
          const slot = getHourSlot(seg.departure.at);
          if (!filterState.departureTime.includes(slot)) return false;
        }
      }

      return true;
    });
  }, [flights, filterState]);

  const handleSelect = (offer: FlightOffer) => {
    selectFlight(offer);
    router.push(`/reserva/${offer.id}`);
  };

  const totalPassengers = adults + children + infants;
  const breadcrumb = [
    origin && destination ? `${origin} → ${destination}` : null,
    departureDate ? formatDate(departureDate) : null,
    `${totalPassengers} ${totalPassengers === 1 ? "Passageiro" : "Passageiros"}`,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="min-h-screen bg-ink-950 pt-20">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-ink-400 font-sans text-xs uppercase tracking-widest mb-1">
              <span>Busca</span>
              <ArrowRight size={12} />
              <span>Resultados</span>
            </div>
            <p className="font-serif text-white text-xl md:text-2xl">
              {origin && destination ? (
                <>
                  {origin}
                  <span className="text-gold mx-2">→</span>
                  {destination}
                </>
              ) : (
                "Resultados de busca"
              )}
            </p>
            {breadcrumb && (
              <p className="font-sans text-ink-400 text-xs mt-0.5">
                {breadcrumb}
              </p>
            )}
          </div>

          <button
            className="md:hidden flex items-center gap-2 border border-ink-700 text-ink-300 px-3 py-2 text-xs uppercase tracking-widest font-sans"
            style={{ borderRadius: "2px" }}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            Filtros
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside
            className={`
              fixed inset-0 z-40 bg-ink-950 p-4 overflow-y-auto
              md:static md:block md:w-72 md:flex-shrink-0 md:p-0
              ${sidebarOpen ? "block" : "hidden"}
            `}
          >
            <div className="md:hidden flex justify-end mb-4">
              <button
                className="text-ink-400 hover:text-white font-sans text-xs uppercase tracking-widest"
                onClick={() => setSidebarOpen(false)}
              >
                Fechar
              </button>
            </div>
            <FlightFilters
              availableAirlines={availableAirlines}
              maxPrice={maxPrice}
              value={filterState}
              onChange={setFilterState}
            />
          </aside>

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-ink-950/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex-1 min-w-0">
            {error && (
              <div className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-5 py-4 mb-6">
                {error}
              </div>
            )}

            <FlightList
              offers={filtered}
              loading={isLoading}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink-950" />}>
      <VoosPageContent />
    </Suspense>
  );
}
