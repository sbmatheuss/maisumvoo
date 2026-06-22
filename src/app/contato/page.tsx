"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import type { ContactFormValues, ContactSubjectValue } from "@/types";

const SUBJECTS: { value: ContactSubjectValue; label: string }[] = [
  { value: "reserva", label: "Dúvidas sobre reserva" },
  { value: "cancelamento", label: "Cancelamento" },
  { value: "reembolso", label: "Reembolso" },
  { value: "bagagem", label: "Bagagem" },
  { value: "checkin", label: "Check-in" },
  { value: "conta", label: "Minha conta" },
  { value: "pagamento", label: "Pagamento" },
  { value: "outro", label: "Outro" },
];

const inputClass =
  "w-full bg-ink-900 border border-ink-800 text-white font-sans text-sm px-4 py-3 outline-none focus:border-ink-600 placeholder:text-ink-500 transition-colors";

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  cpfOrReservation: "",
  subject: "reserva",
  message: "",
};

export default function ContatoPage() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (json.error) {
        setError(json.error);
      } else {
        setSuccess(true);
        setValues(initialValues);
        setTimeout(() => setSuccess(false), 6000);
      }
    } catch {
      setError("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Suporte</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Fale Conosco</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">
            Entre em contato com nossa equipe de suporte pelo canal de sua preferência.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Canais de atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-3">Chat</p>
              <p className="font-serif text-lg text-white mb-2">Atendimento imediato</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Atendimento 24h via chat. Acesse pelo ícone no canto inferior direito da tela.
              </p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-3">E-mail</p>
              <p className="font-serif text-lg text-white mb-2">suporte@maisumvoo.com.br</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Respondemos em até 4 horas úteis. Para casos urgentes, prefira o chat.
              </p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-3">Telefone</p>
              <p className="font-serif text-lg text-white mb-2">0800 000 1234</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Segunda a sexta, das 8h às 20h. Ligação gratuita de qualquer operadora.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Horários de atendimento</h2>
          <div className="border border-ink-800" style={{ borderRadius: "2px" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800 bg-ink-900">
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Dia</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Telefone</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">E-mail</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Chat</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Segunda a sexta</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">8h às 20h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">8h às 20h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Sábado</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">9h às 15h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">9h às 15h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Domingo</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Fechado</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Respondemos na segunda</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
                <tr>
                  <td className="font-sans text-sm text-white px-6 py-4">Feriados nacionais</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Fechado</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Respondemos no dia útil seguinte</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pb-10">
          <h2 className="font-serif text-xl text-white mb-6">Envie uma mensagem</h2>
          <p className="font-sans text-sm text-ink-400 mb-8 leading-relaxed">
            Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
          </p>

          {success && (
            <div
              className="flex items-start gap-3 border border-green-800 bg-green-950/30 text-green-400 font-sans text-sm px-5 py-4 mb-6"
              style={{ borderRadius: "2px" }}
            >
              <CheckCircle size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
              <p>
                Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 4 horas úteis.
              </p>
            </div>
          )}

          {error && (
            <div
              className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-5 py-4 mb-6"
              style={{ borderRadius: "2px" }}
            >
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={values.name}
                  onChange={set("name")}
                  required
                  className={inputClass}
                  style={{ borderRadius: "2px" }}
                />
              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={values.email}
                  onChange={set("email")}
                  required
                  className={inputClass}
                  style={{ borderRadius: "2px" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">
                  CPF ou número de reserva
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00 ou MAV-000000"
                  value={values.cpfOrReservation}
                  onChange={set("cpfOrReservation")}
                  className={inputClass}
                  style={{ borderRadius: "2px" }}
                />
              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">
                  Assunto
                </label>
                <select
                  value={values.subject}
                  onChange={set("subject")}
                  required
                  className={`${inputClass} appearance-none`}
                  style={{ borderRadius: "2px" }}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">
                Mensagem
              </label>
              <textarea
                placeholder="Descreva sua dúvida ou solicitação com o máximo de detalhes possível."
                rows={6}
                value={values.message}
                onChange={set("message")}
                required
                className={`${inputClass} resize-none`}
                style={{ borderRadius: "2px" }}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-sans text-sm font-medium bg-gold text-ink-950 px-8 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: "2px" }}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensagem"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
