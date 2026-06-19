import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/agents/ChatWidget"), { ssr: false });

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  title: "+UmVoo — Passagens Aéreas",
  description:
    "Encontre passagens aéreas com os melhores preços. Compare voos nacionais e internacionais, hotéis e pacotes de viagem.",
  keywords: ["passagens aéreas", "voos baratos", "comprar passagem", "viagem"],
  authors: [{ name: "maisumvoo" }],
  openGraph: {
    title: "maisumvoo — Passagens Aéreas",
    description: "Encontre passagens aéreas com os melhores preços.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="bg-ink-950 text-ink-100 font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
