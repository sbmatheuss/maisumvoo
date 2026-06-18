"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  CreditCard,
  QrCode,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useFlightStore } from "@/store/useFlightStore";
import Summary from "@/components/booking/Summary";
import Button from "@/components/ui/Button";
import GlobeLoader from "@/components/ui/GlobeLoader";

type PaymentMethod = "card" | "pix" | "boleto";

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function PagamentoPage() {
  const router = useRouter();
  const { selectedFlight, searchParams, bookingId } = useFlightStore();

  const adults = searchParams?.adults ?? 1;
  const children = searchParams?.children ?? 0;
  const infants = searchParams?.infants ?? 0;
  const cabinClass = searchParams?.cabinClass ?? "ECONOMY";

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (method === "card") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setError("Preencha todos os dados do cartão.");
        return;
      }
    }

    if (!bookingId) {
      setError("Reserva não encontrada. Volte e tente novamente.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error ?? "Erro ao processar pagamento.");
        return;
      }

      router.push("/minhas-viagens");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  const methodOptions: {
    key: PaymentMethod;
    label: string;
    icon: React.ElementType;
    available: boolean;
  }[] = [
    {
      key: "card",
      label: "Cartão de crédito",
      icon: CreditCard,
      available: true,
    },
    { key: "pix", label: "Pix", icon: QrCode, available: false },
    {
      key: "boleto",
      label: "Boleto bancário",
      icon: FileText,
      available: false,
    },
  ];

  return (
    <>
    <GlobeLoader show={processing} message="Processando pagamento..." />
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">
            <Lock size={12} strokeWidth={1.5} />
            <span>Ambiente seguro</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
            Pagamento seguro
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <h2 className="font-serif text-lg font-bold text-white mb-4">
                Método de pagamento
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {methodOptions.map(({ key, label, icon: Icon, available }) => (
                  <button
                    key={key}
                    disabled={!available}
                    onClick={() => available && setMethod(key)}
                    className={`flex items-center gap-3 border px-4 py-4 text-left transition-colors duration-150 ${
                      method === key && available
                        ? "border-gold text-gold bg-gold/5"
                        : available
                        ? "border-ink-700 text-ink-300 hover:border-ink-500 hover:text-ink-100"
                        : "border-ink-800 text-ink-600 cursor-not-allowed"
                    }`}
                    style={{ borderRadius: "2px" }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest">
                        {label}
                      </p>
                      {!available && (
                        <p className="font-sans text-xs text-ink-600 mt-0.5">
                          Em breve
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {method === "card" && (
              <div className="border border-ink-800 bg-ink-900 p-6 space-y-5">
                <h2 className="font-serif text-lg font-bold text-white">
                  Dados do cartão
                </h2>

                {/*
                  Para integração com Stripe Elements:
                  1. Configure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no .env.local
                  2. Envolva o layout de pagamento em <Elements stripe={loadStripe(key)}>
                  3. Substitua os campos abaixo por <CardElement /> do @stripe/react-stripe-js
                  4. Chame stripe.confirmCardPayment(clientSecret) no handlePayment
                */}

                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                    Número do cartão
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors"
                    style={{ borderRadius: "2px" }}
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                    Nome no cartão
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) =>
                      setCardName(e.target.value.toUpperCase())
                    }
                    placeholder="NOME COMO NO CARTÃO"
                    className="w-full bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors"
                    style={{ borderRadius: "2px" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                      Validade
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(formatExpiry(e.target.value))
                      }
                      placeholder="MM/AA"
                      className="w-full bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors"
                      style={{ borderRadius: "2px" }}
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="000"
                      className="w-full bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors"
                      style={{ borderRadius: "2px" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {method === "pix" && (
              <div className="border border-ink-800 bg-ink-900 p-8 text-center space-y-3">
                <QrCode
                  size={48}
                  strokeWidth={1}
                  className="text-ink-600 mx-auto"
                />
                <p className="font-serif text-white text-lg">QR Code Pix</p>
                <p className="font-sans text-ink-400 text-sm">
                  A integração com Pix será habilitada em breve.
                </p>
              </div>
            )}

            {method === "boleto" && (
              <div className="border border-ink-800 bg-ink-900 p-8 text-center space-y-3">
                <FileText
                  size={48}
                  strokeWidth={1}
                  className="text-ink-600 mx-auto"
                />
                <p className="font-serif text-white text-lg">
                  Boleto bancário
                </p>
                <p className="font-sans text-ink-400 text-sm">
                  A geração de boletos será habilitada em breve.
                </p>
              </div>
            )}

            {error && (
              <div className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-5 py-4">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
              <div className="flex items-center gap-3 text-ink-500">
                <ShieldCheck size={16} strokeWidth={1.5} />
                <span className="font-sans text-xs">
                  Transação criptografada com SSL 256-bit
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processando..." : "Confirmar pagamento"}
                <ArrowRight size={16} strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {selectedFlight ? (
                <Summary
                  offer={selectedFlight}
                  cabinClass={cabinClass}
                  adults={adults}
                  children={children}
                  infants={infants}
                />
              ) : (
                <div
                  className="border border-ink-800 bg-ink-900 p-6"
                  style={{ borderRadius: "2px" }}
                >
                  <p className="font-sans text-ink-400 text-sm">
                    Nenhum voo selecionado.
                  </p>
                </div>
              )}

              <div
                className="border border-ink-800 bg-ink-900 p-5 space-y-3"
                style={{ borderRadius: "2px" }}
              >
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">
                  Segurança
                </p>
                <div className="space-y-2">
                  {[
                    "Dados protegidos por criptografia",
                    "Pagamento processado com segurança",
                    "Não armazenamos dados do cartão",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Lock
                        size={12}
                        strokeWidth={1.5}
                        className="text-gold mt-0.5 flex-shrink-0"
                      />
                      <p className="font-sans text-xs text-ink-400">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
