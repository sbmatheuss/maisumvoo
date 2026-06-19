"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const nav = [
  { label: "Voos", href: "/voos" },
  { label: "Minhas Viagens", href: "/minhas-viagens" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, isInitialized, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      fetchUser();
    }
  }, [isInitialized, fetchUser]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const firstName = user?.name?.split(" ")[0] ?? "";

  const authAreaDesktop = !isInitialized ? null : user ? (
    <div className="flex items-center gap-6">
      <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/70">
        {firstName}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="font-sans text-[11px] uppercase tracking-[0.18em] text-white hover:text-white/70 transition-colors duration-200"
      >
        Sair
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-6">
      <Link
        href="/auth/login"
        className="font-sans text-[11px] uppercase tracking-[0.18em] text-white hover:text-white/70 transition-colors duration-200"
      >
        Entrar
      </Link>
      <Link
        href="/auth/register"
        className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-950 bg-gold px-5 py-2.5 hover:bg-gold-light transition-colors duration-200"
        style={{ borderRadius: "2px" }}
      >
        Cadastrar
      </Link>
    </div>
  );

  const authAreaMobile = !isInitialized ? null : user ? (
    <div className="pt-4 border-t border-ink-800 flex flex-col gap-3">
      <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-300">
        {firstName}
      </span>
      <button
        type="button"
        onClick={async () => {
          setMobileOpen(false);
          await logout();
          router.push("/");
        }}
        className="font-sans text-[11px] uppercase tracking-[0.18em] text-white hover:text-white/70 transition-colors duration-200 text-left"
      >
        Sair
      </button>
    </div>
  ) : (
    <div className="pt-4 border-t border-ink-800 flex flex-col gap-3">
      <Link href="/auth/login" className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-300">
        Entrar
      </Link>
      <Link
        href="/auth/register"
        className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-950 bg-gold px-5 py-2.5 text-center"
        style={{ borderRadius: "2px" }}
      >
        Cadastrar
      </Link>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy/98 backdrop-blur-md border-b border-navy-600/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-8 flex items-center justify-between h-20">
        <Link href="/" className="select-none flex items-center">
          <Image
            src="/logo.svg"
            alt="+UmVoo"
            width={120}
            height={28}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[11px] uppercase tracking-[0.18em] text-white hover:text-white/70 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {authAreaDesktop}
        </div>

        <button
          className="md:hidden text-ink-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-ink-900 border-t border-ink-800 px-8 py-6 flex flex-col gap-5">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-400"
            >
              {link.label}
            </Link>
          ))}
          {authAreaMobile}
        </div>
      )}
    </header>
  );
}
