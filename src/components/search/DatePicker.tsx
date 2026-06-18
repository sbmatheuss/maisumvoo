"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { clsx } from "clsx";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  minDate?: Date;
  light?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  disabled = false,
  label,
  minDate,
  light = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value && isValid(parseISO(value))
    ? parseISO(value)
    : undefined;

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

  function handleSelect(day: Date | undefined) {
    if (day) {
      onChange(format(day, "yyyy-MM-dd"));
      setOpen(false);
    }
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
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={clsx(
          "w-full flex items-center justify-between font-sans text-sm text-left outline-none transition-colors duration-150",
          light
            ? clsx(
                "bg-transparent py-1",
                open ? "text-navy" : "",
                disabled ? "opacity-40 cursor-not-allowed text-navy/35" : "cursor-pointer text-navy"
              )
            : clsx(
                "bg-ink-900 border border-ink-700 px-3 py-2.5",
                open && "border-gold",
                disabled ? "opacity-40 cursor-not-allowed text-ink-500" : "cursor-pointer text-ink-100 hover:border-ink-500"
              )
        )}
        style={light ? undefined : { borderRadius: "2px" }}
      >
        <span className={clsx(
          light
            ? (selected ? "text-navy" : "text-navy/35")
            : (selected ? "text-ink-100" : "text-ink-500")
        )}>
          {selected ? format(selected, "dd MMM", { locale: ptBR }) : placeholder}
        </span>
        <Calendar size={14} className={light ? "text-navy/30 shrink-0" : "text-ink-400 shrink-0"} />
      </button>

      {open && !disabled && (
        <div
          className={clsx(
            "absolute z-50 top-full left-0 mt-1 p-3 shadow-lg",
            light ? "bg-parchment border border-navy/15" : "bg-ink-900 border border-ink-800"
          )}
          style={{ borderRadius: "2px" }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            locale={ptBR}
            disabled={minDate ? { before: minDate } : undefined}
            classNames={{
              root: "font-sans",
              months: "flex flex-col gap-4",
              month: "w-full",
              caption: "flex justify-between items-center mb-3",
              caption_label: clsx("text-sm font-medium capitalize", light ? "text-navy" : "text-ink-100"),
              nav: "flex gap-2",
              nav_button: clsx(
                "transition-colors p-1",
                light ? "text-navy/40 hover:text-navy" : "text-ink-400 hover:text-ink-100"
              ),
              nav_button_previous: "",
              nav_button_next: "",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell: clsx("w-9 text-center text-xs uppercase pb-2", light ? "text-navy/40" : "text-ink-500"),
              row: "flex mt-1",
              cell: "w-9 text-center p-0",
              day: clsx(
                "w-9 h-9 text-sm font-sans flex items-center justify-center transition-colors cursor-pointer",
                light ? "text-navy/70 hover:bg-navy/5 hover:text-navy" : "text-ink-300 hover:bg-ink-800 hover:text-ink-100"
              ),
              day_selected: "bg-gold text-navy font-semibold hover:bg-gold-dark",
              day_today: "text-gold",
              day_disabled: clsx("opacity-30 cursor-not-allowed", light ? "hover:bg-transparent hover:text-navy/70" : "hover:bg-transparent hover:text-ink-300"),
              day_outside: "opacity-30",
            }}
          />
        </div>
      )}
    </div>
  );
}
