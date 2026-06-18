import Image from "next/image";
import Link from "next/link";
import SearchForm from "@/components/search/SearchForm";

const destinations = [
  {
    city: "Rio de Janeiro",
    country: "Brasil",
    iata: "GIG",
    price: 389,
    photo: "photo-1483729558449-99ef09a8c325",
  },
  {
    city: "Buenos Aires",
    country: "Argentina",
    iata: "EZE",
    price: 920,
    photo: "photo-1504893524553-b855bce32c67",
  },
  {
    city: "Fortaleza",
    country: "Brasil",
    iata: "FOR",
    price: 441,
    photo: "photo-1568454537842-d933259bb258",
  },
  {
    city: "Florianópolis",
    country: "Brasil",
    iata: "FLN",
    price: 312,
    photo: "photo-1507525428034-b723cf961d3e",
  },
  {
    city: "São Paulo",
    country: "Brasil",
    iata: "GRU",
    price: 210,
    photo: "photo-1554168848-228452c09d60",
  },
  {
    city: "Recife",
    country: "Brasil",
    iata: "REC",
    price: 498,
    photo: "photo-1612383892465-153167840470",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=90"
          alt="Vista aérea de asa de avião"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Navy gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,31,51,0.45) 0%, rgba(10,31,51,0.65) 50%, rgba(10,31,51,0.96) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-screen-xl mx-auto w-full px-6 md:px-12 pb-12 pt-36">
          {/* Eyebrow */}
          <p className="font-sans text-[11px] uppercase tracking-[1.5px] text-gold mb-4">
            Passagens aéreas · tarifas diretas
          </p>

          {/* Headline */}
          <h1
            className="font-serif font-medium text-parchment leading-[1.1] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
          >
            precisão na hora<br />
            <span style={{ color: "rgba(250,249,246,0.55)" }}>de partir.</span>
          </h1>

          <p className="font-sans text-sm md:text-base text-parchment/70 max-w-md mb-10 leading-relaxed">
            comparação direta entre todas as companhias nacionais, sem intermediário e sem variação de preço no checkout.
          </p>

          {/* Search form */}
          <SearchForm />
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────────── */}
      <div className="bg-parchment border-b border-navy/10">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-navy/10">
          {[
            ["47", "destinos nacionais"],
            ["12", "destinos internacionais"],
            ["0%", "taxa de serviço"],
            ["R$ 189", "tarifa mínima hoje"],
          ].map(([num, label], i) => (
            <div key={label} className="px-8 py-5">
              <p className={`font-serif text-xl mb-0.5 ${i === 3 ? "text-gold-dark" : "text-navy"}`}>
                {num}
              </p>
              <p className="font-sans text-xs text-navy/50">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── DESTINOS ──────────────────────────────────────────── */}
      <section className="bg-parchment px-6 md:px-12 py-20">
        <div className="max-w-screen-xl mx-auto">

          {/* Cabeçalho */}
          <div className="flex items-end justify-between mb-10 border-b border-navy/10 pb-6">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-navy/40 mb-2">
                Tarifas atualizadas diariamente
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-navy leading-tight">
                Destinos em alta
              </h2>
            </div>
            <Link
              href="/voos"
              className="hidden md:block font-sans text-[10px] uppercase tracking-[0.2em] text-navy/40 hover:text-navy transition-colors pb-1 border-b border-navy/20 hover:border-navy/50"
            >
              Ver todos
            </Link>
          </div>

          {/* Grade assimétrica */}
          <div className="grid grid-cols-12 gap-2.5">

            {/* Destaque — 7 colunas */}
            <Link
              href={`/voos?origin=GRU&destination=${destinations[0].iata}`}
              className="col-span-12 md:col-span-7 group relative overflow-hidden"
              style={{ height: "clamp(260px, 42vw, 480px)" }}
            >
              <Image
                src={`https://images.unsplash.com/${destinations[0].photo}?auto=format&fit=crop&w=1200&q=85`}
                alt={destinations[0].city}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7">
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-parchment/70 mb-1.5">
                  {destinations[0].country}
                </p>
                <h3
                  className="font-serif text-3xl md:text-4xl text-parchment leading-tight mb-3"
                  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
                >
                  {destinations[0].city}
                </h3>
                <p className="font-sans text-sm text-parchment/80">
                  A partir de{" "}
                  <span className="text-gold font-medium">
                    R$ {destinations[0].price.toLocaleString("pt-BR")}
                  </span>
                </p>
              </div>
            </Link>

            {/* Coluna direita — 5 colunas, 2 cards */}
            <div
              className="col-span-12 md:col-span-5 grid grid-rows-2 gap-2.5"
              style={{ height: "clamp(260px, 42vw, 480px)" }}
            >
              {destinations.slice(1, 3).map((dest) => (
                <Link
                  key={dest.iata}
                  href={`/voos?origin=GRU&destination=${dest.iata}`}
                  className="group relative overflow-hidden"
                >
                  <Image
                    src={`https://images.unsplash.com/${dest.photo}?auto=format&fit=crop&w=800&q=80`}
                    alt={dest.city}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-parchment/70 mb-1">
                      {dest.country}
                    </p>
                    <h3
                      className="font-serif text-2xl text-parchment mb-1.5"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
                    >
                      {dest.city}
                    </h3>
                    <p className="font-sans text-xs text-parchment/80">
                      A partir de{" "}
                      <span className="text-gold">R$ {dest.price.toLocaleString("pt-BR")}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Linha inferior — 3 cards */}
            {destinations.slice(3).map((dest) => (
              <Link
                key={dest.iata}
                href={`/voos?origin=GRU&destination=${dest.iata}`}
                className="col-span-12 md:col-span-4 group relative overflow-hidden"
                style={{ height: "200px" }}
              >
                <Image
                  src={`https://images.unsplash.com/${dest.photo}?auto=format&fit=crop&w=700&q=80`}
                  alt={dest.city}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-parchment/70 mb-1">
                    {dest.country}
                  </p>
                  <h3
                    className="font-serif text-xl text-parchment mb-1"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                  >
                    {dest.city}
                  </h3>
                  <p className="font-sans text-xs text-gold">
                    R$ {dest.price.toLocaleString("pt-BR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POR QUE MAISUMVOO ─────────────────────────────────── */}
      <section className="bg-parchment-dark border-t border-navy/10 px-6 md:px-12 py-20">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-navy/40 mb-4">
              Por que maisumvoo
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-navy leading-tight">
              Tecnologia que encontra<br />o voo certo para você.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 border-l border-navy/10 pl-14">
            {[
              ["Monitoramento", "Alertas automáticos quando o preço da sua rota cai."],
              ["Comparação", "Centenas de combinações analisadas em segundos."],
              ["Atendimento", "Suporte 24h via chat para qualquer dúvida."],
              ["Segurança", "Análise de risco em tempo real antes de cada compra."],
            ].map(([title, desc]) => (
              <div key={title}>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold-dark mb-2">
                  {title}
                </p>
                <p className="font-sans text-xs text-navy/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
