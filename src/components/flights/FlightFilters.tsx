"use client";

import { useState } from "react";
import { clsx } from "clsx";

export interface FlightFiltersState {
  priceRange: [number, number];
  airlines: string[];
  stops: ("direct" | "one" | "two_plus")[];
  departureTime: ("morning" | "afternoon" | "night")[];
}

interface FlightFiltersProps {
  availableAirlines: string[];
  maxPrice: number;
  value: FlightFiltersState;
  onChange: (filters: FlightFiltersState) => void;
}

const STOP_OPTIONS = [
  { value: "direct" as const, label: "Sem escala" },
  { value: "one" as const, label: "1 escala" },
  { value: "two_plus" as const, label: "2 ou mais" },
];

const TIME_OPTIONS = [
  { value: "morning" as const, label: "Manhã", sublabel: "05:00 – 12:00" },
  { value: "afternoon" as const, label: "Tarde", sublabel: "12:00 – 18:00" },
  { value: "night" as const, label: "Noite", sublabel: "18:00 – 05:00" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-3">
      {children}
    </h3>
  );
}

function CustomCheckbox({
  checked,
  onChange,
  label,
  sublabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <span
        className={clsx(
          "w-4 h-4 shrink-0 border transition-colors duration-150",
          checked
            ? "bg-gold border-gold"
            : "bg-ink-800 border-ink-600 group-hover:border-ink-400"
        )}
        style={{ borderRadius: "2px" }}
      >
        {checked && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-full h-full text-ink-950 p-0.5"
          >
            <path
              d="M3 8l3.5 3.5L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="flex flex-col">
        <span className="font-sans text-sm text-ink-100">{label}</span>
        {sublabel && (
          <span className="font-sans text-xs text-ink-400">{sublabel}</span>
        )}
      </span>
    </label>
  );
}

export default function FlightFilters({
  availableAirlines,
  maxPrice,
  value,
  onChange,
}: FlightFiltersProps) {
  const [priceInput, setPriceInput] = useState(value.priceRange[1]);

  function toggleStop(stop: FlightFiltersState["stops"][number]) {
    const next = value.stops.includes(stop)
      ? value.stops.filter((s) => s !== stop)
      : [...value.stops, stop];
    onChange({ ...value, stops: next });
  }

  function toggleAirline(airline: string) {
    const next = value.airlines.includes(airline)
      ? value.airlines.filter((a) => a !== airline)
      : [...value.airlines, airline];
    onChange({ ...value, airlines: next });
  }

  function toggleTime(time: FlightFiltersState["departureTime"][number]) {
    const next = value.departureTime.includes(time)
      ? value.departureTime.filter((t) => t !== time)
      : [...value.departureTime, time];
    onChange({ ...value, departureTime: next });
  }

  function handlePriceChange(newMax: number) {
    setPriceInput(newMax);
    onChange({ ...value, priceRange: [value.priceRange[0], newMax] });
  }

  return (
    <aside className="flex flex-col gap-6 w-full">
      <div>
        <SectionTitle>Preço</SectionTitle>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={50}
            value={priceInput}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full accent-gold"
            style={{
              background: `linear-gradient(to right, #C8A96E 0%, #C8A96E ${
                (priceInput / maxPrice) * 100
              }%, #252525 ${(priceInput / maxPrice) * 100}%, #252525 100%)`,
            }}
          />
          <div className="flex justify-between">
            <span className="font-sans text-xs text-ink-400">R$ 0</span>
            <span className="font-sans text-xs text-ink-100">
              R${" "}
              {priceInput.toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>

      {availableAirlines.length > 0 && (
        <div>
          <SectionTitle>Companhias aéreas</SectionTitle>
          <div className="flex flex-col gap-3">
            {availableAirlines.map((airline) => (
              <CustomCheckbox
                key={airline}
                label={airline}
                checked={value.airlines.includes(airline)}
                onChange={() => toggleAirline(airline)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionTitle>Escalas</SectionTitle>
        <div className="flex flex-col gap-3">
          {STOP_OPTIONS.map((opt) => (
            <CustomCheckbox
              key={opt.value}
              label={opt.label}
              checked={value.stops.includes(opt.value)}
              onChange={() => toggleStop(opt.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Horário de partida</SectionTitle>
        <div className="flex flex-col gap-3">
          {TIME_OPTIONS.map((opt) => (
            <CustomCheckbox
              key={opt.value}
              label={opt.label}
              sublabel={opt.sublabel}
              checked={value.departureTime.includes(opt.value)}
              onChange={() => toggleTime(opt.value)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
