import Image from "next/image";
import { clsx } from "clsx";
import Button from "@/components/ui/Button";
import type { FlightOffer } from "@/types";

const DESTINATION_IMAGES: Record<string, string> = {
  GRU: "photo-1560439513-74b037a25d84",
  SAO: "photo-1560439513-74b037a25d84",
  GIG: "photo-1483729558449-99ef09a8c325",
  RIO: "photo-1483729558449-99ef09a8c325",
  BSB: "photo-1592194996308-7b43878e84a6",
  FOR: "photo-1568454537842-d933259bb258",
  SSA: "photo-1544989164-b14a0c6b1f1b",
};

const DEFAULT_IMAGE = "photo-1436491865332-7a61a109cc05";

function getDestinationImage(iataCode: string): string {
  const id = DESTINATION_IMAGES[iataCode.toUpperCase()] ?? DEFAULT_IMAGE;
  return `https://images.unsplash.com/${id}?w=800&q=80`;
}

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const h = match[1] ?? "0";
  const m = match[2] ?? "0";
  return `${h}h ${m}m`;
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

interface FlightCardProps {
  offer: FlightOffer;
  onSelect?: (offer: FlightOffer) => void;
}

export default function FlightCard({ offer, onSelect }: FlightCardProps) {
  const itinerary = offer.itineraries[0];
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  const destinationIata = lastSegment.arrival.iataCode;
  const imageUrl =
    offer.destinationImage ?? getDestinationImage(destinationIata);

  const stopsLabel =
    offer.stops === 0
      ? "Direto"
      : offer.stops === 1
      ? "1 escala"
      : `${offer.stops} escalas`;

  const airlines = offer.validatingAirlineCodes.join(", ");

  return (
    <article
      className={clsx(
        "group bg-ink-900 border border-ink-800",
        "hover:border-gold/40 transition-colors duration-200",
        "overflow-hidden flex flex-col"
      )}
      style={{ borderRadius: "2px" }}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={offer.destinationCity ?? destinationIata}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
        <span className="absolute bottom-3 left-3 font-sans text-xs uppercase tracking-widest text-ink-300">
          {offer.destinationCity ?? destinationIata}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="font-sans text-lg font-semibold text-ink-100 leading-none">
                {formatTime(firstSegment.departure.at)}
              </span>
              <span className="font-sans text-xs text-ink-400 mt-0.5">
                {firstSegment.departure.iataCode}
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5 px-2">
              <span className="font-sans text-xs text-ink-400">
                {formatDuration(itinerary.duration)}
              </span>
              <div className="w-16 h-px bg-ink-700 relative">
                {offer.stops > 0 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-ink-500 rounded-full" />
                )}
              </div>
              <span className="font-sans text-xs text-ink-500">
                {stopsLabel}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-sans text-lg font-semibold text-ink-100 leading-none">
                {formatTime(lastSegment.arrival.at)}
              </span>
              <span className="font-sans text-xs text-ink-400 mt-0.5">
                {lastSegment.arrival.iataCode}
              </span>
            </div>
          </div>

          <span className="font-sans text-xs text-ink-400 ml-4">{airlines}</span>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-ink-400 uppercase tracking-widest">
              por pessoa
            </span>
            <span className="font-serif text-2xl font-bold text-gold leading-tight">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: offer.price.currency || "BRL",
                minimumFractionDigits: 2,
              }).format(Number(offer.price.perAdult))}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelect?.(offer)}
          >
            Selecionar
          </Button>
        </div>

        {offer.seatsAvailable <= 5 && offer.seatsAvailable > 0 && (
          <p className="font-sans text-xs text-ink-400">
            Apenas {offer.seatsAvailable}{" "}
            {offer.seatsAvailable === 1 ? "assento" : "assentos"} disponíveis
          </p>
        )}
      </div>
    </article>
  );
}
