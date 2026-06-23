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
  Copy,
  CheckCircle,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useFlightStore } from "@/store/useFlightStore";
import Summary from "@/components/booking/Summary";
import Button from "@/components/ui/Button";
import GlobeLoader from "@/components/ui/GlobeLoader";

type PaymentMethod = "card" | "pix" | "boleto";

interface PixData {
  imageUrl: string;
  data: string;
  expiresAt: Date;
}

interface BoletoData {
  number: string;
  url: string;
  dueDate: Date;
}

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

// ─── Card Form (must live inside <Elements>) ──────────────────────────────────

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
          <Button
            variant="primary"
            size="lg"
            onClick={handlePay}
            disabled={processing || !stripe}
          >
            {processing ? "Processando..." : "Confirmar pagamento"}
            {!processing && <ArrowRight size={16} strokeWidth={1.5} />}
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Pix Section ─────────────────────────────────────────────────────────────

interface PixSectionProps {
  clientSecret: string | null;
  onError: (msg: string) => void;
  pixData: PixData | null;
  setPixData: (d: PixData) => void;
  fetchingIntent: boolean;
}

function PixSection({
  clientSecret,
  onError,
  pixData,
  setPixData,
  fetchingIntent,
}: PixSectionProps) {
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConfirmPix = async () => {
    if (!stripePromise || !clientSecret) return;
    const stripe = await stripePromise;
    if (!stripe) return;

    setProcessing(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { paymentIntent, error } = await (stripe as any).confirmPixPayment(clientSecret);
      if (error) {
        onError(error.message ?? "Erro ao gerar código Pix.");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const next = (paymentIntent as any)?.next_action?.pix_display_qr_code;
      if (next) {
        setPixData({
          imageUrl: next.image_url_png,
          data: next.data,
          expiresAt: new Date(next.expires_at * 1000),
        });
      }
    } catch {
      onError("Erro ao processar Pix. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!pixData?.data) return;
    navigator.clipboard.writeText(pixData.data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (fetchingIntent) {
    return (
      <div className="h-32 flex items-center justify-center">
        <p className="font-sans text-xs text-ink-500 uppercase tracking-widest">Carregando...</p>
      </div>
    );
  }

  if (pixData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4">
            <img src={pixData.imageUrl} alt="QR Code Pix" className="w-48 h-48" />
          </div>
          <div className="text-center">
            <p className="font-sans text-sm text-ink-300 mb-1">
              Escaneie o código com seu aplicativo bancário
            </p>
            <p className="font-sans text-xs text-ink-500">
              Válido até {pixData.expiresAt.toLocaleTimeString("pt-BR")}
            </p>
          </div>
        </div>

        {pixData.data && (
          <div className="bg-ink-800 p-4 space-y-2">
            <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Pix Copia e Cola</p>
            <p className="font-mono text-xs text-ink-300 break-all line-clamp-3">{pixData.data}</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 font-sans text-xs text-gold hover:text-gold/80 transition-colors"
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? "Copiado!" : "Copiar código"}
            </button>
          </div>
        )}

        <div className="border border-ink-700 p-4">
          <p className="font-sans text-xs text-ink-400">
            Após o pagamento, a confirmação pode levar alguns minutos. Acompanhe em{" "}
            <span className="text-gold">Minhas Viagens</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-sans text-sm text-ink-400">
        Clique abaixo para gerar o QR Code Pix. O código ficará válido por 30 minutos.
      </p>
      <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
        <div className="flex items-center gap-3 text-ink-500">
          <ShieldCheck size={16} strokeWidth={1.5} />
          <span className="font-sans text-xs">Transação criptografada com SSL 256-bit</span>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmPix}
          disabled={processing || !clientSecret || !stripePromise}
        >
          {processing ? "Gerando..." : "Gerar QR Code"}
          {!processing && <QrCode size={16} strokeWidth={1.5} />}
        </Button>
      </div>
    </div>
  );
}

// ─── Boleto Section ───────────────────────────────────────────────────────────

interface BoletoSectionProps {
  clientSecret: string | null;
  onError: (msg: string) => void;
  boletoData: BoletoData | null;
  setBoletoData: (d: BoletoData) => void;
  fetchingIntent: boolean;
  contactName: string;
  contactEmail: string;
}

function BoletoSection({
  clientSecret,
  onError,
  boletoData,
  setBoletoData,
  fetchingIntent,
  contactName,
  contactEmail,
}: BoletoSectionProps) {
  const [processing, setProcessing] = useState(false);

  const handleConfirmBoleto = async () => {
    if (!stripePromise || !clientSecret) return;
    const stripe = await stripePromise;
    if (!stripe) return;

    setProcessing(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { paymentIntent, error } = await (stripe as any).confirmBoletoPayment(clientSecret, {
        payment_method: {
          billing_details: {
            name: contactName || "Passageiro",
            email: contactEmail || "passageiro@maisumvoo.com.br",
            address: {
              line1: "Av. Brasil, 1000",
              city: "São Paulo",
              state: "SP",
              postal_code: "01000-100",
              country: "BR",
            },
          },
        },
      });

      if (error) {
        onError(error.message ?? "Erro ao gerar boleto.");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const next = (paymentIntent as any)?.next_action?.boleto_display_details;
      if (next) {
        setBoletoData({
          number: next.number ?? "",
          url: next.hosted_voucher_url ?? "",
          dueDate: new Date(next.expires_at * 1000),
        });
      }
    } catch {
      onError("Erro ao gerar boleto. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  if (fetchingIntent) {
    return (
      <div className="h-32 flex items-center justify-center">
        <p className="font-sans text-xs text-ink-500 uppercase tracking-widest">Carregando...</p>
      </div>
    );
  }

  if (boletoData) {
    return (
      <div className="space-y-4">
        <div className="bg-ink-800 p-6 space-y-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">
              Código do boleto
            </p>
            <p className="font-mono text-sm text-gold break-all">{boletoData.number}</p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">
              Vencimento
            </p>
            <p className="font-sans text-sm text-ink-300">
              {boletoData.dueDate.toLocaleDateString("pt-BR")}
            </p>
          </div>
          {boletoData.url && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.open(boletoData.url, "_blank")}
            >
              Visualizar boleto
              <FileText size={16} strokeWidth={1.5} />
            </Button>
          )}
        </div>
        <div className="border border-ink-700 p-4">
          <p className="font-sans text-xs text-ink-400">
            O pagamento é confirmado em até 3 dias úteis. Acompanhe o status em{" "}
            <span className="text-gold">Minhas Viagens</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-sans text-sm text-ink-400">
        Gere o boleto bancário abaixo. O prazo de vencimento é de 3 dias úteis.
      </p>
      <div className="border border-ink-700 bg-ink-800/30 p-4">
        <p className="font-sans text-xs text-ink-500">
          Após o pagamento, o processamento pode levar até 3 dias úteis. Seu bilhete será emitido
          após a confirmação.
        </p>
      </div>
      <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
        <div className="flex items-center gap-3 text-ink-500">
          <ShieldCheck size={16} strokeWidth={1.5} />
          <span className="font-sans text-xs">Transação criptografada com SSL 256-bit</span>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmBoleto}
          disabled={processing || !clientSecret || !stripePromise}
        >
          {processing ? "Gerando boleto..." : "Gerar boleto"}
          {!processing && <ArrowRight size={16} strokeWidth={1.5} />}
        </Button>
      </div>
    </div>
  );
}

// ─── Simulate Payment Section ────────────────────────────────────────────────

interface SimulatePaymentSectionProps {
  bookingId: string | null;
  onError: (msg: string) => void;
}

function SimulatePaymentSection({ bookingId, onError }: SimulatePaymentSectionProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleSimulate = async () => {
    if (!bookingId) {
      onError("Nenhuma reserva encontrada. Volte e selecione um voo.");
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const json = await res.json();
      if (json.error) {
        onError(json.error);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/minhas-viagens"), 1500);
    } catch {
      onError("Erro ao simular pagamento. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  if (done) {
    return (
      <div
        className="border border-green-800 bg-green-950/30 p-6 flex items-center gap-4"
        style={{ borderRadius: "2px" }}
      >
        <CheckCircle size={24} strokeWidth={1.5} className="text-green-400 shrink-0" />
        <div>
          <p className="font-serif text-white text-lg">Pagamento confirmado!</p>
          <p className="font-sans text-sm text-ink-400 mt-0.5">
            Redirecionando para suas viagens...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-ink-800 bg-ink-900 p-6 space-y-5" style={{ borderRadius: "2px" }}>
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">
          Ambiente de desenvolvimento
        </p>
        <h2 className="font-serif text-lg font-bold text-white">
          Simular pagamento
        </h2>
        <p className="font-sans text-sm text-ink-400 mt-2">
          O Stripe não está configurado. Use o botão abaixo para confirmar a reserva diretamente, simulando um pagamento aprovado.
        </p>
      </div>

      <div className="border border-ink-700 bg-ink-800/40 p-4 space-y-2">
        {[
          "Reserva confirmada instantaneamente",
          "Nenhum dado de cartão necessário",
          "Fluxo idêntico ao pagamento real",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <CheckCircle size={13} strokeWidth={1.5} className="text-gold shrink-0" />
            <p className="font-sans text-xs text-ink-400">{item}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 text-ink-500">
          <ShieldCheck size={16} strokeWidth={1.5} />
          <span className="font-sans text-xs">Somente para fins de demonstração</span>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSimulate}
          disabled={processing || !bookingId}
        >
          {processing ? "Confirmando..." : "Simular pagamento aprovado"}
          {!processing && <ArrowRight size={16} strokeWidth={1.5} />}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [boletoData, setBoletoData] = useState<BoletoData | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Fetch booking contact details for boleto billing
  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setContactEmail(json.data.contactEmail ?? "");
          const passenger = json.data.passengers?.[0];
          if (passenger) {
            setContactName(`${passenger.firstName} ${passenger.lastName}`);
          }
        }
      })
      .catch(() => {});
  }, [bookingId]);

  // Reset per-method state when method changes
  useEffect(() => {
    setClientSecret(null);
    setPixData(null);
    setBoletoData(null);
    setError(null);
    setFetchAttempted(false);
  }, [method]);

  // Fetch clientSecret for the selected payment method
  useEffect(() => {
    if (!bookingId || fetchAttempted) return;

    setFetchAttempted(true);
    setFetchingIntent(true);
    setError(null);

    fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, paymentMethod: method }),
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
  }, [bookingId, method, fetchAttempted]);

  const methodOptions: {
    key: PaymentMethod;
    label: string;
    icon: React.ElementType;
  }[] = [
    { key: "card", label: "Cartão de crédito", icon: CreditCard },
    { key: "pix", label: "Pix", icon: QrCode },
    { key: "boleto", label: "Boleto bancário", icon: FileText },
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

              {/* Seletor de método */}
              <div className="border border-ink-800 bg-ink-900 p-6">
                <h2 className="font-serif text-lg font-bold text-white mb-4">
                  Método de pagamento
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {methodOptions.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setMethod(key)}
                      className={`flex items-center gap-3 border px-4 py-4 text-left transition-colors duration-150 ${
                        method === key
                          ? "border-gold text-gold bg-gold/5"
                          : "border-ink-700 text-ink-300 hover:border-ink-500 hover:text-ink-100"
                      }`}
                      style={{ borderRadius: "2px" }}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      <p className="font-sans text-xs uppercase tracking-widest">{label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulação de pagamento (quando Stripe não está configurado) */}
              {!publishableKey && (
                <SimulatePaymentSection
                  bookingId={bookingId}
                  onError={setError}
                />
              )}

              {/* Cartão de crédito */}
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

              {/* Pix */}
              {method === "pix" && publishableKey && (
                <div className="border border-ink-800 bg-ink-900 p-6">
                  <h2 className="font-serif text-lg font-bold text-white mb-5">Pix</h2>
                  <PixSection
                    clientSecret={clientSecret}
                    onError={setError}
                    pixData={pixData}
                    setPixData={setPixData}
                    fetchingIntent={fetchingIntent}
                  />
                </div>
              )}

              {/* Boleto */}
              {method === "boleto" && publishableKey && (
                <div className="border border-ink-800 bg-ink-900 p-6">
                  <h2 className="font-serif text-lg font-bold text-white mb-5">
                    Boleto Bancário
                  </h2>
                  <BoletoSection
                    clientSecret={clientSecret}
                    onError={setError}
                    boletoData={boletoData}
                    setBoletoData={setBoletoData}
                    fetchingIntent={fetchingIntent}
                    contactName={contactName}
                    contactEmail={contactEmail}
                  />
                </div>
              )}

              {error && (
                <div
                  className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-5 py-4"
                  style={{ borderRadius: "2px" }}
                >
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
                  <div
                    className="border border-ink-800 bg-ink-900 p-6"
                    style={{ borderRadius: "2px" }}
                  >
                    <p className="font-sans text-ink-400 text-sm">Nenhum voo selecionado.</p>
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
                      "Pagamento processado pelo Stripe",
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
