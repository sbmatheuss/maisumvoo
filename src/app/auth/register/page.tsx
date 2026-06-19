"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === "cpf" ? formatCPF(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (form.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          cpf: form.cpf,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error ?? "Erro ao criar conta.");
        return;
      }

      router.push("/auth/login");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-ink-800 border border-ink-700 text-ink-100 font-sans text-sm px-4 py-3 placeholder-ink-600 focus:outline-none focus:border-gold transition-colors";

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-500 mb-3">
            Criar conta
          </p>
          <h1 className="font-serif text-3xl text-white leading-tight">
            Cadastrar
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Seu nome"
              required
              autoComplete="name"
              className={inputClass}
              style={{ borderRadius: "2px" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                CPF
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.cpf}
                onChange={set("cpf")}
                placeholder="000.000.000-00"
                required
                className={inputClass}
                style={{ borderRadius: "2px" }}
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+55 11 99999-9999"
                autoComplete="tel"
                className={inputClass}
                style={{ borderRadius: "2px" }}
              />
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className={inputClass}
              style={{ borderRadius: "2px" }}
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="Mínimo 8 caracteres"
              required
              autoComplete="new-password"
              className={inputClass}
              style={{ borderRadius: "2px" }}
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
              Confirmar senha
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              placeholder="Repita a senha"
              required
              autoComplete="new-password"
              className={inputClass}
              style={{ borderRadius: "2px" }}
            />
          </div>

          {error && (
            <div className="border border-red-900/50 bg-red-950/20 text-red-400 font-sans text-sm px-4 py-3" style={{ borderRadius: "2px" }}>
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={loading}
            className="w-full justify-center"
          >
            <UserPlus size={14} strokeWidth={1.5} />
            {loading ? "Criando conta..." : "Criar conta"}
            {!loading && <ArrowRight size={14} strokeWidth={1.5} />}
          </Button>
        </form>

        <p className="font-sans text-xs text-ink-500 mt-8 text-center">
          Já tem uma conta?{" "}
          <Link
            href="/auth/login"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
