"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useFlightStore } from "@/store/useFlightStore";
import { PassengerInfo } from "@/types";
import { formatDuration, formatDateTime } from "@/lib/utils";
import PassengerForm from "@/components/booking/PassengerForm";
import Summary from "@/components/booking/Summary";
import Button from "@/components/ui/Button";

export default function ReservaPage() {
  const router = useRouter();
  const { selectedFlight, searchParams, setBookingId } = useFlightStore();

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const adults = searchParams?.adults ?? 1;
  const children = searchParams?.children ?? 0;
  const infants = searchParams?.infants ?? 0;
  const cabinClass = searchParams?.cabinClass ?? "ECONOMY";

  const handlePassengersSubmit = async (passengers: PassengerInfo[]) => {
    if (!contactEmail || !contactPhone) {
      setFormError("Informe e-mail e telefone de contato.");
      return;
    }
    if (!selectedFlight) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const itinerary = selectedFlight.itineraries[0];
      const firstSeg = itinerary.segments[0];
      const lastSeg = itinerary.segments[itinerary.segments.length - 1];

      const payload = {
        flightOfferId: selectedFlight.id,
        amadeus_offerId: selectedFlight.amadeus_offerId,
        passengers,
        contactEmail,
        contactPhone,
        totalAmount: parseFloat(selectedFlight.price.total),
        origin: firstSeg.departure.iataCode,
        destination: lastSeg.arrival.iataCode,
        departureAt: firstSeg.departure.at,
        arrivalAt: lastSeg.arrival.at,
        airline: selectedFlight.validatingAirlineCodes[0],
        flightNumber: `${firstSeg.carrierCode}${firstSeg.number}`,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setFormError(json.error ?? "Erro ao criar reserva.");
        return;
      }

      setBookingId(json.data.bookingId);
      router.push("/pagamento");
    } catch {
      setFormError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <p className="font-serif text-white text-2xl">
            Nenhum voo selecionado.
          </p>
          <p className="font-sans text-ink-400 text-sm">
            Volte à busca e selecione um voo para continuar.
          </p>
          <Button variant="secondary" onClick={() => router.push("/voos")}>
            <ArrowLeft size={14} strokeWidth={1.5} />
            Buscar voos
          </Button>
        </div>
      </div>
    );
  }

  const itinerary = selectedFlight.itineraries[0];
  const firstSeg = itinerary.segments[0];
  const lastSeg = itinerary.segments[itinerary.segments.length - 1];
  const dep = formatDateTime(firstSeg.departure.at);

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 text-ink-400 font-sans text-xs uppercase tracking-widest mb-1">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 hover:text-ink-100 transition-colors"
            >
              <ArrowLeft size={12} />
              Resultados
            </button>
            <ArrowRight size={12} />
            <span className="text-ink-100">Passageiros</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
            Informações dos passageiros
          </h1>
          <p className="font-sans text-ink-400 text-xs mt-1">
            {firstSeg.departure.iataCode} → {lastSeg.arrival.iataCode} ·{" "}
            {dep.date} · {formatDuration(itinerary.duration)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-white">
                Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors"
                    style={{ borderRadius: "2px" }}
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    className="w-full bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors"
                    style={{ borderRadius: "2px" }}
                  />
                </div>
              </div>
            </div>

            <PassengerForm
              passengerCount={{ adults, children, infants }}
              onSubmit={handlePassengersSubmit}
            />

            {formError && (
              <div className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-5 py-4">
                {formError}
              </div>
            )}

            {submitting && (
              <p className="font-sans text-xs text-ink-400 text-right">
                Processando sua reserva...
              </p>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <Summary
                offer={selectedFlight}
                cabinClass={cabinClass}
                adults={adults}
                children={children}
                infants={infants}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
