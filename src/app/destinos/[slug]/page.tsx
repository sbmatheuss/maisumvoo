import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const destinations = {
  "sao-paulo": {
    name: "São Paulo",
    state: "São Paulo · SP",
    iata: "GRU",
    iataSecondary: "CGH",
    priceFrom: 210,
    unsplashId: "photo-1554168848-228452c09d60",
    description:
      "Centro financeiro e cultural do Brasil, São Paulo oferece gastronomia de nível mundial, museus de classe internacional e uma vida noturna vibrante.",
    highlights: [
      "Gastronomia diversa",
      "Museus e cultura",
      "Negócios e convenções",
      "Shows e eventos",
    ],
    airports: [
      {
        code: "GRU",
        name: "Aeroporto Int. de Guarulhos",
        distance: "30 km do centro",
      },
      {
        code: "CGH",
        name: "Aeroporto de Congonhas",
        distance: "8 km do centro",
      },
    ],
    tips: [
      "Melhor época: abril a junho",
      "Evite horário de rush",
      "Metrô é a melhor opção de transporte",
    ],
  },
  "rio-de-janeiro": {
    name: "Rio de Janeiro",
    state: "Rio de Janeiro · RJ",
    iata: "GIG",
    iataSecondary: "SDU",
    priceFrom: 389,
    unsplashId: "photo-1483729558449-99ef09a8c325",
    description:
      "A Cidade Maravilhosa combina praias deslumbrantes, trilhas na Mata Atlântica e uma cultura única que conquista visitantes do mundo todo.",
    highlights: [
      "Praias icônicas",
      "Cristo Redentor",
      "Carnaval",
      "Vida noturna",
    ],
    airports: [
      {
        code: "GIG",
        name: "Aeroporto Int. do Galeão",
        distance: "20 km do centro",
      },
      {
        code: "SDU",
        name: "Aeroporto Santos Dumont",
        distance: "2 km do centro",
      },
    ],
    tips: [
      "Melhor época: maio a setembro",
      "Evite verão (calor intenso e chuvas)",
      "Cuidado com pertences em locais turísticos",
    ],
  },
  fortaleza: {
    name: "Fortaleza",
    state: "Ceará · CE",
    iata: "FOR",
    iataSecondary: undefined,
    priceFrom: 441,
    unsplashId: "photo-1568454537842-d933259bb258",
    description:
      "Capital do Ceará, Fortaleza é conhecida pelas praias de águas mornas, lagoas de kite surf e a hospitalidade do povo nordestino.",
    highlights: [
      "Praias de água morna",
      "Kite surf",
      "Gastronomia nordestina",
      "Artesanato local",
    ],
    airports: [
      {
        code: "FOR",
        name: "Aeroporto Int. Pinto Martins",
        distance: "6 km do centro",
      },
    ],
    tips: [
      "Sol o ano todo",
      "Melhor época: julho a dezembro",
      "Passeio de buggy nas dunas é imperdível",
    ],
  },
  salvador: {
    name: "Salvador",
    state: "Bahia · BA",
    iata: "SSA",
    iataSecondary: undefined,
    priceFrom: 498,
    unsplashId: "photo-1586861635167-e5223aadc9fe",
    description:
      "Primeira capital do Brasil, Salvador é um tesouro cultural afro-brasileiro com Pelourinho tombado pela UNESCO, culinária única e música que embala a cidade.",
    highlights: [
      "Pelourinho",
      "Culinária baiana",
      "Carnaval",
      "Candomblé e cultura afro",
    ],
    airports: [
      {
        code: "SSA",
        name: "Aeroporto Int. Dep. Luís Eduardo Magalhães",
        distance: "28 km do centro",
      },
    ],
    tips: [
      "Carnaval em fevereiro é o maior do mundo",
      "Melhor época: setembro a março",
      "Experimente acarajé no Mercado Modelo",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(destinations).map((slug) => ({ slug }));
}

export default function DestinoPage({ params }: { params: { slug: string } }) {
  const dest = destinations[params.slug as keyof typeof destinations];
  if (!dest) notFound();

  return (
    <main className="min-h-screen bg-ink-950">
      <div className="relative h-72 bg-ink-900">
        <Image
          src={`https://images.unsplash.com/${dest.unsplashId}?auto=format&fit=crop&w=1400&q=85`}
          alt={dest.name}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.85) 100%)",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <span className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">
            Destino
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-1">
            {dest.name}
          </h1>
          <p className="font-sans text-sm text-ink-400 mb-3">{dest.state}</p>
          <p className="font-serif text-2xl text-gold">
            A partir de R$ {dest.priceFrom}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <section>
          <p className="font-sans text-sm text-ink-400 leading-relaxed max-w-2xl">
            {dest.description}
          </p>
        </section>

        <div className="border-t border-ink-800" />

        <section>
          <span className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6 block">
            Destaques
          </span>
          <div className="grid grid-cols-2 gap-4">
            {dest.highlights.map((item) => (
              <div
                key={item}
                className="border border-ink-800 bg-ink-900 px-5 py-4"
                style={{ borderRadius: "2px" }}
              >
                <p className="font-sans text-sm text-ink-100">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-ink-800" />

        <section>
          <span className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6 block">
            Aeroportos
          </span>
          <div className="space-y-3">
            {dest.airports.map((airport) => (
              <div
                key={airport.code}
                className="border border-ink-800 bg-ink-900 px-5 py-4 flex items-start justify-between"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-start gap-4">
                  <span className="font-serif text-lg font-bold text-gold leading-none pt-0.5">
                    {airport.code}
                  </span>
                  <p className="font-sans text-sm text-ink-100">{airport.name}</p>
                </div>
                <p className="font-sans text-xs text-ink-500 text-right whitespace-nowrap ml-4 pt-0.5">
                  {airport.distance}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-ink-800" />

        <section>
          <span className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6 block">
            Dicas de viagem
          </span>
          <ul className="space-y-3">
            {dest.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span
                  className="mt-1.5 w-1 h-1 bg-gold flex-shrink-0"
                  style={{ borderRadius: "2px" }}
                />
                <p className="font-sans text-sm text-ink-400 leading-relaxed">
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-ink-800" />

        <section className="flex flex-col items-start gap-4">
          <p className="font-sans text-sm text-ink-400">
            Pronto para conhecer {dest.name}?
          </p>
          <Link
            href={`/voos?destination=${dest.iata}`}
            className="bg-gold text-ink-950 px-8 py-3 font-sans text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ borderRadius: "2px" }}
          >
            Buscar voos para {dest.name}
          </Link>
        </section>
      </div>
    </main>
  );
}
