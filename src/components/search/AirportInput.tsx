"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { clsx } from "clsx";
import type { AirportSuggestion } from "@/types";

interface AirportInputProps {
  value: string;
  onChange: (airport: AirportSuggestion) => void;
  placeholder?: string;
  label?: string;
  light?: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function AirportInput({
  value,
  onChange,
  placeholder = "Cidade ou aeroporto",
  label,
  light = false,
}: AirportInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AirportSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/flights/airports?q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.data ?? []);
        setOpen(true);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

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

  function handleSelect(airport: AirportSuggestion) {
    setQuery(`${airport.iataCode} — ${airport.city}`);
    setSuggestions([]);
    setOpen(false);
    onChange(airport);
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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className={clsx(
          "w-full font-sans text-sm outline-none ring-0 transition-colors duration-150",
          light
            ? "bg-transparent border-0 text-navy placeholder:text-navy/35 focus:outline-none py-1"
            : "bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-500 px-3 py-2.5 focus:border-gold"
        )}
        style={light ? undefined : { borderRadius: "2px" }}
        autoComplete="off"
      />

      {loading && (
        <span className={clsx(
          "absolute right-3 top-1/2 -translate-y-1/2 mt-1 w-4 h-4 border-2 rounded-full animate-spin",
          light ? "border-navy/20 border-t-gold" : "border-ink-700 border-t-gold"
        )} />
      )}

      {open && suggestions.length > 0 && (
        <ul
          className={clsx(
            "absolute z-50 top-full left-0 right-0 mt-1 overflow-y-auto max-h-64 shadow-lg",
            light
              ? "bg-parchment border border-navy/15"
              : "bg-ink-900 border border-ink-800"
          )}
          style={{ borderRadius: "2px" }}
        >
          {suggestions.map((airport) => (
            <li key={airport.iataCode}>
              <button
                type="button"
                onClick={() => handleSelect(airport)}
                className={clsx(
                  "w-full text-left px-4 py-3 transition-colors flex items-center gap-3",
                  light ? "hover:bg-navy/5" : "hover:bg-ink-800"
                )}
              >
                <span className="font-sans text-sm font-bold text-gold min-w-[40px]">
                  {airport.iataCode}
                </span>
                <span className="flex flex-col">
                  <span className={clsx(
                    "font-sans text-sm",
                    light ? "text-navy" : "text-ink-100"
                  )}>
                    {airport.name}
                  </span>
                  <span className={clsx(
                    "font-sans text-xs",
                    light ? "text-navy/50" : "text-ink-300"
                  )}>
                    {airport.city}, {airport.country}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
