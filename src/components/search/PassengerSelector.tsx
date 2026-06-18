"use client";

import { useState, useRef, useEffect } from "react";
import { Users } from "lucide-react";
import { clsx } from "clsx";

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: PassengerCounts;
  onChange: (counts: PassengerCounts) => void;
  label?: string;
  light?: boolean;
}

function Counter({
  label,
  sublabel,
  value,
  min,
  max,
  onIncrement,
  onDecrement,
  light = false,
}: {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
  light?: boolean;
}) {
  return (
    <div className={clsx(
      "flex items-center justify-between py-3 border-b last:border-0",
      light ? "border-navy/10" : "border-ink-800"
    )}>
      <div className="flex flex-col">
        <span className={clsx("font-sans text-sm", light ? "text-navy" : "text-ink-100")}>{label}</span>
        {sublabel && (
          <span className={clsx("font-sans text-xs", light ? "text-navy/50" : "text-ink-400")}>{sublabel}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className={clsx(
            "w-7 h-7 flex items-center justify-center text-base font-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
            light ? "bg-navy/8 text-navy hover:bg-navy/15" : "bg-ink-700 text-ink-100 hover:bg-ink-600"
          )}
          style={{ borderRadius: "2px" }}
          aria-label={`Reduzir ${label}`}
        >
          −
        </button>
        <span className={clsx("font-sans text-sm w-4 text-center", light ? "text-navy" : "text-ink-100")}>
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={value >= max}
          className={clsx(
            "w-7 h-7 flex items-center justify-center text-base font-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
            light ? "bg-navy/8 text-navy hover:bg-navy/15" : "bg-ink-700 text-ink-100 hover:bg-ink-600"
          )}
          style={{ borderRadius: "2px" }}
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function summaryLabel(counts: PassengerCounts): string {
  const parts: string[] = [];
  if (counts.adults > 0) {
    parts.push(`${counts.adults} ${counts.adults === 1 ? "Adulto" : "Adultos"}`);
  }
  if (counts.children > 0) {
    parts.push(
      `${counts.children} ${counts.children === 1 ? "Criança" : "Crianças"}`
    );
  }
  if (counts.infants > 0) {
    parts.push(`${counts.infants} ${counts.infants === 1 ? "Bebê" : "Bebês"}`);
  }
  return parts.join(", ") || "Passageiros";
}

export default function PassengerSelector({
  value,
  onChange,
  label,
  light = false,
}: PassengerSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function update(key: keyof PassengerCounts, delta: number) {
    onChange({ ...value, [key]: value[key] + delta });
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className={clsx(
          "block font-sans text-xs uppercase tracking-widest mb-1.5",
          light ? "text-navy/50" : "text-ink-400"
        )}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "w-full flex items-center justify-between font-sans text-sm text-left outline-none transition-colors duration-150 cursor-pointer",
          light
            ? "bg-transparent py-1 text-navy"
            : clsx(
                "bg-ink-900 border border-ink-700 px-3 py-2.5 text-ink-100",
                open ? "border-gold" : "hover:border-ink-500"
              )
        )}
        style={light ? undefined : { borderRadius: "2px" }}
      >
        <span>{summaryLabel(value)}</span>
        <Users size={14} className={light ? "text-navy/30 shrink-0" : "text-ink-400 shrink-0"} />
      </button>

      {open && (
        <div
          className={clsx(
            "absolute z-50 top-full left-0 right-0 mt-1 p-4 min-w-[240px] shadow-lg",
            light ? "bg-parchment border border-navy/15" : "bg-ink-900 border border-ink-800"
          )}
          style={{ borderRadius: "2px" }}
        >
          <Counter
            label="Adultos"
            sublabel="12 anos ou mais"
            value={value.adults}
            min={1}
            max={9}
            onIncrement={() => update("adults", 1)}
            onDecrement={() => update("adults", -1)}
            light={light}
          />
          <Counter
            label="Crianças"
            sublabel="2 a 11 anos"
            value={value.children}
            min={0}
            max={8}
            onIncrement={() => update("children", 1)}
            onDecrement={() => update("children", -1)}
            light={light}
          />
          <Counter
            label="Bebês"
            sublabel="Até 23 meses"
            value={value.infants}
            min={0}
            max={4}
            onIncrement={() => update("infants", 1)}
            onDecrement={() => update("infants", -1)}
            light={light}
          />
        </div>
      )}
    </div>
  );
}
