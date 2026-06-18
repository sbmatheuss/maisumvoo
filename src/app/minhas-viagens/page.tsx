"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, PlaneTakeoff, Inbox } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface BookingRecord {
  id: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  airline: string;
  flightNumber: string;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  passengers: { firstName: string; lastName: string; type: string }[];
  createdAt: string;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  CONFIRMED: {
    label: "Confirmado",
    className: "text-emerald-400 bg-emerald-950/30 border border-emerald-900/50",
  },
  PENDING: {
    label: "Pendente",
    className: "text-gold bg-gold/10 border border-gold/30",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "text-ink-500 bg-ink-800 border border-ink-700",
  },
};

export default function MinhasViagensPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setFetchError(null);
    setBookings([]);

    try {
      const isEmail = trimmed.includes("@");
      const param = isEmail
        ? `email=${encodeURIComponent(trimmed)}`
        : `cpf=${encodeURIComponent(trimmed)}`;

      const res = await fetch(`/api/bookings/list?${param}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setFetchError(json.error ?? "Erro ao buscar reservas.");
      } else {
        setBookings(json.data ?? []);
      }
    } catch {
      setFetchError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
            Histórico
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Minhas viagens
          </h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">
            Insira seu e-mail ou CPF para localizar suas reservas.
          </p>

          <div className="flex gap-2 mt-6 max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="E-mail ou CPF"
              className="flex-1 bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors"
              style={{ borderRadius: "2px" }}
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
            >
              <Search size={14} strokeWidth={1.5} />
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {fetchError && (
          <div className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-5 py-4 mb-6">
            {fetchError}
          </div>
        )}

        {!searched && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <PlaneTakeoff size={40} strokeWidth={1} className="text-ink-700" />
            <p className="font-serif text-white text-xl">
              Nenhuma viagem encontrada.
            </p>
            <p className="font-sans text-ink-400 text-sm max-w-sm">
              Insira seu e-mail ou CPF para buscar suas reservas e visualizar o
              histórico de viagens.
            </p>
          </div>
        )}

        {searched && !loading && bookings.length === 0 && !fetchError && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <Inbox size={40} strokeWidth={1} className="text-ink-700" />
            <p className="font-serif text-white text-xl">
              Nenhuma reserva encontrada.
            </p>
            <p className="font-sans text-ink-400 text-sm max-w-sm">
              Não encontramos reservas associadas a esse e-mail ou CPF.
            </p>
            <Link href="/">
              <Button variant="secondary" size="md">
                Buscar voos
                <ArrowRight size={14} strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="space-y-4">
            <p className="font-sans text-xs uppercase tracking-widest text-ink-400">
              {bookings.length} reserva{bookings.length !== 1 ? "s" : ""} encontrada
              {bookings.length !== 1 ? "s" : ""}
            </p>

            {bookings.map((booking) => {
              const statusCfg = statusConfig[booking.status];
              return (
                <div
                  key={booking.id}
                  className="border border-ink-800 bg-ink-900 p-6"
                  style={{ borderRadius: "2px" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-white text-xl">
                          {booking.origin}
                        </span>
                        <ArrowRight
                          size={16}
                          strokeWidth={1.5}
                          className="text-gold"
                        />
                        <span className="font-serif text-white text-xl">
                          {booking.destination}
                        </span>
                        <span
                          className={`font-sans text-xs uppercase tracking-widest px-2.5 py-1 ${statusCfg.className}`}
                          style={{ borderRadius: "2px" }}
                        >
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-2">
                        <div>
                          <p className="font-sans text-xs text-ink-500 uppercase tracking-widest">
                            Partida
                          </p>
                          <p className="font-sans text-sm text-ink-100 mt-0.5">
                            {formatDate(booking.departureAt)}
                          </p>
                        </div>
                        <div>
                          <p className="font-sans text-xs text-ink-500 uppercase tracking-widest">
                            Voo
                          </p>
                          <p className="font-sans text-sm text-ink-100 mt-0.5">
                            {booking.flightNumber}
                          </p>
                        </div>
                        <div>
                          <p className="font-sans text-xs text-ink-500 uppercase tracking-widest">
                            Passageiros
                          </p>
                          <p className="font-sans text-sm text-ink-100 mt-0.5">
                            {booking.passengers.length}{" "}
                            {booking.passengers.length === 1
                              ? "passageiro"
                              : "passageiros"}
                          </p>
                        </div>
                      </div>

                      {booking.passengers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {booking.passengers.map((p, i) => (
                            <span
                              key={i}
                              className="font-sans text-xs text-ink-400 bg-ink-800 px-2.5 py-1 border border-ink-700"
                              style={{ borderRadius: "2px" }}
                            >
                              {p.firstName} {p.lastName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-sans text-xs text-ink-500 uppercase tracking-widest">
                          Total
                        </p>
                        <p className="font-serif text-white text-xl font-bold mt-0.5">
                          {formatCurrency(booking.totalAmount / 100, booking.currency)}
                        </p>
                      </div>
                      <Link href={`/reserva/${booking.id}`}>
                        <Button variant="secondary" size="sm">
                          Ver detalhes
                          <ArrowRight size={12} strokeWidth={1.5} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
