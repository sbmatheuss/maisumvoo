"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  QrCode,
  FileText,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useFlightStore } from "@/store/useFlightStore";
import Summary from "@/components/booking/Summary";
import Button from "@/components/ui/Button";
import GlobeLoader from "@/components/ui/GlobeLoader";

type PaymentMethod = "card" | "pix" | "boleto";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const stripeAppearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#D9B66B",
    colorBackground: "#1A1A1A",
    colorText: "#EBEBEB",
    colorDanger: "#f87171",
    borderRadius: "2px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeBase: "14px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "1px solid #333333", padding: "12px 16px" },
    ".Input:focus": { border: "1px solid #D9B66B", boxShadow: "none" },
    ".Label": {
      fontSize: "10px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.1em",
      color: "#8A8A8A",
    },
  },
};

// ─── Inner form (must live inside <Elements>) ────────────────────────────────

interface StripeCardFormProps {
  clientSecret: string;
  onError: (msg: string) => void;
}

function StripeCardForm({ clientSecret, onError }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message ?? "Verifique os dados do cartão.");
      setProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/minhas-viagens` },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message ?? "Pagamento recusado. Tente novamente.");
      setProcessing(false);
      return;
    }

    router.push("/minhas-viagens");
  };

  return (
    <>
      <GlobeLoader show={processing} message="Processando pagamento..." />
      <div className="space-y-5">
        <PaymentElement />
        <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
          <div className="flex items-center gap-3 text-ink-500">
            <ShieldCheck size={16} strokeWidth={1.5} />
            <span className="font-sans text-xs">Transação criptografada com SSL 256-bit</span>
          </div>
          <Button variant="primary" size="lg" onClick={handlePay} disabled={processing || !stripe}>
            {processing ? "Processando..." : "Confirmar pagamento"}
            {!processing && <ArrowRight size={16} strokeWidth={1.5} />}
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PagamentoPage() {
  const router = useRouter();
  const { selectedFlight, searchParams, bookingId } = useFlightStore();

  const adults = searchParams?.adults ?? 1;
  const children = searchParams?.children ?? 0;
  const infants = searchParams?.infants ?? 0;
  const cabinClass = searchParams?.cabinClass ?? "ECONOMY";

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchingIntent, setFetchingIntent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId || method !== "card" || clientSecret) return;

    setFetchingIntent(true);
    setError(null);

    fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setClientSecret(json.data?.clientSecret ?? null);
        }
      })
      .catch(() => setError("Erro ao inicializar pagamento. Tente novamente."))
      .finally(() => setFetchingIntent(false));
  }, [bookingId, method, clientSecret]);

  const methodOptions: { key: PaymentMethod; label: string; icon: React.ElementType; available: boolean }[] = [
    { key: "card", label: "Cartão de crédito", icon: CreditCard, available: true },
    { key: "pix", label: "Pix", icon: QrCode, available: false },
    { key: "boleto", label: "Boleto bancário", icon: FileText, available: false },
  ];

  return (
    <>
      <GlobeLoader show={fetchingIntent} message="Preparando pagamento..." />
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

              {/* Método de pagamento */}
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
                        <p className="font-sans text-xs uppercase tracking-widest">{label}</p>
                        {!available && (
                          <p className="font-sans text-xs text-ink-600 mt-0.5">Em breve</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aviso: Stripe não configurado */}
              {method === "card" && !publishableKey && (
                <div className="border border-yellow-900/50 bg-yellow-950/20 text-yellow-400 font-sans text-sm px-5 py-4 flex items-start gap-3" style={{ borderRadius: "2px" }}>
                  <AlertTriangle size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
                  <p>
                    Stripe não está configurado.{" "}
                    <span className="text-yellow-500">Defina <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> no <code>.env.local</code> para habilitar pagamentos.</span>
                  </p>
                </div>
              )}

              {/* Stripe Elements */}
              {method === "card" && publishableKey && (
                <div className="border border-ink-800 bg-ink-900 p-6">
                  <h2 className="font-serif text-lg font-bold text-white mb-5">
                    Dados do pagamento
                  </h2>

                  {clientSecret && stripePromise ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: stripeAppearance }}
                    >
                      <StripeCardForm clientSecret={clientSecret} onError={setError} />
                    </Elements>
                  ) : (
                    <div className="h-32 flex items-center justify-center">
                      <p className="font-sans text-xs text-ink-500 uppercase tracking-widest">
                        {fetchingIntent ? "Carregando..." : "Aguardando dados da reserva..."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {method === "pix" && (
                <div className="border border-ink-800 bg-ink-900 p-8 text-center space-y-3">
                  <QrCode size={48} strokeWidth={1} className="text-ink-600 mx-auto" />
                  <p className="font-serif text-white text-lg">QR Code Pix</p>
                  <p className="font-sans text-ink-400 text-sm">A integração com Pix será habilitada em breve.</p>
                </div>
              )}

              {method === "boleto" && (
                <div className="border border-ink-800 bg-ink-900 p-8 text-center space-y-3">
                  <FileText size={48} strokeWidth={1} className="text-ink-600 mx-auto" />
                  <p className="font-serif text-white text-lg">Boleto bancário</p>
                  <p className="font-sans text-ink-400 text-sm">A geração de boletos será habilitada em breve.</p>
                </div>
              )}

              {error && (
                <div className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-5 py-4" style={{ borderRadius: "2px" }}>
                  {error}
                </div>
              )}
            </div>

            {/* Sidebar */}
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
                  <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
                    <p className="font-sans text-ink-400 text-sm">Nenhum voo selecionado.</p>
                  </div>
                )}

                <div className="border border-ink-800 bg-ink-900 p-5 space-y-3" style={{ borderRadius: "2px" }}>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Segurança</p>
                  <div className="space-y-2">
                    {[
                      "Dados protegidos por criptografia",
                      "Pagamento processado pelo Stripe",
                      "Não armazenamos dados do cartão",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Lock size={12} strokeWidth={1.5} className="text-gold mt-0.5 flex-shrink-0" />
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
