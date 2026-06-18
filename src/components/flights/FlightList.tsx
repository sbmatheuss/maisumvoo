"use client";

import { useState } from "react";
import { clsx } from "clsx";
import FlightCard from "./FlightCard";
import type { FlightOffer } from "@/types";

type SortKey = "price" | "duration" | "best";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price", label: "Menor preço" },
  { value: "duration", label: "Mais rápido" },
  { value: "best", label: "Melhor custo-benefício" },
];

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (Number(match[1] ?? 0)) * 60 + Number(match[2] ?? 0);
}

function sortOffers(offers: FlightOffer[], key: SortKey): FlightOffer[] {
  return [...offers].sort((a, b) => {
    if (key === "price") {
      return Number(a.price.total) - Number(b.price.total);
    }
    if (key === "duration") {
      const da = parseDuration(a.itineraries[0]?.duration ?? "PT0H");
      const db = parseDuration(b.itineraries[0]?.duration ?? "PT0H");
      return da - db;
    }
    const priceScore =
      (Number(a.price.total) - Number(b.price.total)) /
      Math.max(Number(b.price.total), 1);
    const durA = parseDuration(a.itineraries[0]?.duration ?? "PT0H");
    const durB = parseDuration(b.itineraries[0]?.duration ?? "PT0H");
    const durationScore = (durA - durB) / Math.max(durB, 1);
    return priceScore * 0.6 + durationScore * 0.4;
  });
}

function SkeletonCard() {
  return (
    <div
      className="bg-ink-900 border border-ink-800 overflow-hidden"
      style={{ borderRadius: "2px" }}
    >
      <div className="aspect-video bg-ink-800 animate-pulse" />
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <div className="h-6 w-12 bg-ink-800 animate-pulse" style={{ borderRadius: "2px" }} />
            <div className="h-3 w-8 bg-ink-700 animate-pulse" style={{ borderRadius: "2px" }} />
          </div>
          <div className="flex flex-col items-center gap-1 px-3">
            <div className="h-3 w-10 bg-ink-700 animate-pulse" style={{ borderRadius: "2px" }} />
            <div className="h-px w-16 bg-ink-800" />
            <div className="h-3 w-10 bg-ink-700 animate-pulse" style={{ borderRadius: "2px" }} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-6 w-12 bg-ink-800 animate-pulse" style={{ borderRadius: "2px" }} />
            <div className="h-3 w-8 bg-ink-700 animate-pulse" style={{ borderRadius: "2px" }} />
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <div className="h-3 w-16 bg-ink-700 animate-pulse" style={{ borderRadius: "2px" }} />
            <div className="h-7 w-24 bg-ink-800 animate-pulse" style={{ borderRadius: "2px" }} />
          </div>
          <div className="h-8 w-20 bg-ink-800 animate-pulse" style={{ borderRadius: "2px" }} />
        </div>
      </div>
    </div>
  );
}

interface FlightListProps {
  offers: FlightOffer[];
  loading?: boolean;
  onSelect?: (offer: FlightOffer) => void;
}

export default function FlightList({
  offers,
  loading = false,
  onSelect,
}: FlightListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("price");

  const sorted = sortOffers(offers, sortKey);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-0 border-b border-ink-800 pb-0">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSortKey(opt.value)}
            className={clsx(
              "font-sans text-xs uppercase tracking-widest py-2.5 px-4",
              "border-b-2 transition-colors duration-150 -mb-px",
              sortKey === opt.value
                ? "border-gold text-ink-100"
                : "border-transparent text-ink-400 hover:text-ink-200"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : offers.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <p className="font-serif text-2xl text-ink-300">
            Nenhum voo encontrado para esta rota.
          </p>
          <p className="font-sans text-sm text-ink-500">
            Tente ajustar as datas ou os filtros de busca.
          </p>
        </div>
      ) : (
        <>
          <p className="font-sans text-xs text-ink-400">
            {sorted.length} {sorted.length === 1 ? "resultado" : "resultados"} encontrados
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map((offer) => (
              <FlightCard key={offer.id} offer={offer} onSelect={onSelect} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
