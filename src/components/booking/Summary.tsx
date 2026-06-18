import { clsx } from "clsx";
import type { FlightOffer } from "@/types";

interface SummaryProps {
  offer: FlightOffer;
  cabinClass: string;
  adults: number;
  children: number;
  infants: number;
}

const CABIN_LABELS: Record<string, string> = {
  ECONOMY: "Econômica",
  PREMIUM_ECONOMY: "Econômica Premium",
  BUSINESS: "Executiva",
  FIRST: "Primeira Classe",
};

function formatCurrency(value: string | number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

function formatTime(isoDateTime: string): string {
  try {
    return new Date(isoDateTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoDateTime;
  }
}

function formatDate(isoDateTime: string): string {
  try {
    return new Date(isoDateTime).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDateTime;
  }
}

function LineItem({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={clsx(
          "font-sans text-sm",
          subtle ? "text-ink-400" : "text-ink-300"
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          "font-sans text-sm",
          subtle ? "text-ink-400" : "text-ink-100"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function Summary({
  offer,
  cabinClass,
  adults,
  children,
  infants,
}: SummaryProps) {
  const itinerary = offer.itineraries[0];
  const firstSeg = itinerary.segments[0];
  const lastSeg = itinerary.segments[itinerary.segments.length - 1];
  const currency = offer.price.currency || "BRL";

  const basePerAdult = Number(offer.price.base);
  const totalBase = basePerAdult * adults;
  const totalPrice = Number(offer.price.total);
  const taxes = totalPrice - totalBase;
  const childDiscount = children > 0 ? basePerAdult * children * 0.75 : 0;
  const infantFee = infants > 0 ? basePerAdult * infants * 0.1 : 0;

  return (
    <aside
      className="bg-ink-900 border border-ink-800 p-6 flex flex-col gap-6"
      style={{ borderRadius: "2px" }}
    >
      <div>
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-4">
          Resumo da reserva
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg text-ink-100">
              {firstSeg.departure.city ?? firstSeg.departure.iataCode}
            </span>
            <span className="font-sans text-xs text-ink-400 mx-2">→</span>
            <span className="font-serif text-lg text-ink-100">
              {lastSeg.arrival.city ?? lastSeg.arrival.iataCode}
            </span>
          </div>

          <div className="font-sans text-xs text-ink-400">
            {formatDate(firstSeg.departure.at)} •{" "}
            {formatTime(firstSeg.departure.at)} –{" "}
            {formatTime(lastSeg.arrival.at)}
          </div>

          <div className="font-sans text-xs text-ink-400">
            {CABIN_LABELS[cabinClass] ?? cabinClass} •{" "}
            {offer.validatingAirlineCodes.join(", ")}
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800 pt-4 flex flex-col gap-3">
        <h3 className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">
          Composição do preço
        </h3>

        {adults > 0 && (
          <LineItem
            label={`${adults} ${adults === 1 ? "Adulto" : "Adultos"}`}
            value={formatCurrency(totalBase, currency)}
          />
        )}
        {children > 0 && (
          <LineItem
            label={`${children} ${children === 1 ? "Criança" : "Crianças"}`}
            value={formatCurrency(childDiscount, currency)}
          />
        )}
        {infants > 0 && (
          <LineItem
            label={`${infants} ${infants === 1 ? "Bebê" : "Bebês"}`}
            value={formatCurrency(infantFee, currency)}
          />
        )}
        <LineItem
          label="Taxas e tarifas"
          value={formatCurrency(taxes, currency)}
          subtle
        />
      </div>

      <div className="border-t border-ink-800 pt-4">
        <div className="flex items-end justify-between">
          <span className="font-sans text-xs uppercase tracking-widest text-ink-400">
            Total
          </span>
          <span className="font-serif text-3xl font-bold text-gold leading-none">
            {formatCurrency(totalPrice, currency)}
          </span>
        </div>
        <p className="font-sans text-xs text-ink-500 text-right mt-1">
          Todos os impostos incluídos
        </p>
      </div>
    </aside>
  );
}
