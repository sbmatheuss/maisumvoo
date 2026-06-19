"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error ?? "Credenciais inválidas.");
        return;
      }

      router.push("/minhas-viagens");
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
            Acesso à conta
          </p>
          <h1 className="font-serif text-3xl text-white leading-tight">
            Entrar
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
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
            <Lock size={14} strokeWidth={1.5} />
            {loading ? "Entrando..." : "Entrar"}
            {!loading && <ArrowRight size={14} strokeWidth={1.5} />}
          </Button>
        </form>

        <p className="font-sans text-xs text-ink-500 mt-8 text-center">
          Não tem uma conta?{" "}
          <Link
            href="/auth/register"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
