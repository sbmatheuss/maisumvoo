import Link from "next/link";

export default function ImprensaPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Mídia</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Imprensa</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">
            Informações, releases e materiais para jornalistas e veículos de comunicação.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-4">Contato para imprensa</p>
          <div className="border border-ink-800 bg-ink-900 p-6 md:flex md:items-center md:justify-between gap-6">
            <div>
              <p className="font-serif text-lg font-bold text-white mb-2">Assessoria de Comunicação</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed max-w-md">
                Nossa equipe de comunicação atende solicitações de entrevistas, dados, comentários e materiais institucionais. Respondemos em até 24 horas em dias úteis.
              </p>
            </div>
            <a
              href="mailto:imprensa@maisumvoo.com.br"
              className="inline-block mt-4 md:mt-0 font-sans text-xs uppercase tracking-widest text-gold border border-gold px-6 py-3 hover:bg-gold hover:text-ink-950 transition-colors whitespace-nowrap"
            >
              imprensa@maisumvoo.com.br
            </a>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Releases recentes</p>
          <div className="space-y-3">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <p className="font-serif text-base font-bold text-white">maisumvoo alcança 100 mil usuários em apenas 6 meses de operação</p>
                <p className="font-sans text-xs text-ink-500 uppercase tracking-widest whitespace-nowrap">14 Jan 2026</p>
              </div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                A plataforma de compra de passagens aéreas maisumvoo atingiu a marca de 100 mil usuários cadastrados em menos de seis meses desde o lançamento público, consolidando-se como uma das startups de viagens de crescimento mais acelerado do Brasil. O resultado supera as projeções iniciais em mais de 40%.
              </p>
              <a
                href="mailto:imprensa@maisumvoo.com.br?subject=Release - 100 mil usuários"
                className="font-sans text-xs uppercase tracking-widest text-gold hover:text-gold-light transition-colors"
              >
                Solicitar release completo
              </a>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <p className="font-serif text-base font-bold text-white">maisumvoo anuncia expansão para destinos internacionais na América Latina</p>
                <p className="font-sans text-xs text-ink-500 uppercase tracking-widest whitespace-nowrap">03 Mar 2026</p>
              </div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                A empresa anuncia a integração com companhias aéreas internacionais e a oferta de voos para Argentina, Chile, Colômbia e Peru. A expansão faz parte do plano de crescimento para 2026, que prevê a cobertura de 15 destinos na América do Sul até o fim do ano.
              </p>
              <a
                href="mailto:imprensa@maisumvoo.com.br?subject=Release - Expansão internacional"
                className="font-sans text-xs uppercase tracking-widest text-gold hover:text-gold-light transition-colors"
              >
                Solicitar release completo
              </a>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <p className="font-serif text-base font-bold text-white">Parceria com companhias regionais amplia cobertura para 47 destinos nacionais</p>
                <p className="font-sans text-xs text-ink-500 uppercase tracking-widest whitespace-nowrap">19 Mai 2026</p>
              </div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Novos acordos com três companhias aéreas regionais brasileiras adicionam 18 rotas ao portfólio da maisumvoo, com foco em cidades do interior do Nordeste e da região Norte. A iniciativa faz parte do compromisso da empresa com a democratização do transporte aéreo no Brasil.
              </p>
              <a
                href="mailto:imprensa@maisumvoo.com.br?subject=Release - Parceria regional"
                className="font-sans text-xs uppercase tracking-widest text-gold hover:text-gold-light transition-colors"
              >
                Solicitar release completo
              </a>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Kit de mídia</p>
          <div className="border border-ink-800 bg-ink-900 p-6">
            <p className="font-serif text-lg font-bold text-white mb-3">Materiais institucionais</p>
            <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6">
              Disponibilizamos um kit completo de ativos visuais para uso editorial. Inclui logotipos em diferentes versões (positivo, negativo e monocromático), paleta de cores oficial, fotos da equipe em alta resolução e fotografias institucionais licenciadas para uso pela imprensa.
            </p>
            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <div className="border border-ink-700 p-4">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">Logotipos</p>
                <p className="font-sans text-xs text-ink-500">SVG, PNG — fundo claro e escuro</p>
              </div>
              <div className="border border-ink-700 p-4">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">Fotos da equipe</p>
                <p className="font-sans text-xs text-ink-500">JPG 300dpi — uso editorial</p>
              </div>
              <div className="border border-ink-700 p-4">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">Guia de marca</p>
                <p className="font-sans text-xs text-ink-500">PDF — diretrizes de uso</p>
              </div>
            </div>
            <a
              href="mailto:imprensa@maisumvoo.com.br?subject=Solicitação Kit de Mídia"
              className="inline-block font-sans text-xs uppercase tracking-widest text-gold border border-gold px-6 py-3 hover:bg-gold hover:text-ink-950 transition-colors"
            >
              Solicitar kit de mídia
            </a>
          </div>
        </div>

        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Cobertura recente</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-2">Folha de S.Paulo</p>
              <p className="font-serif text-sm font-bold text-white leading-snug">
                &ldquo;Startup de passagens aéreas aposta em transparência para crescer no Brasil&rdquo;
              </p>
              <p className="font-sans text-xs text-ink-500 mt-2">Caderno de Negócios</p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-2">G1 / Globo</p>
              <p className="font-serif text-sm font-bold text-white leading-snug">
                &ldquo;maisumvoo: como uma startup quer acabar com as taxas escondidas nas passagens aéreas&rdquo;
              </p>
              <p className="font-sans text-xs text-ink-500 mt-2">Economia e Tecnologia</p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-2">InfoMoney</p>
              <p className="font-serif text-sm font-bold text-white leading-snug">
                &ldquo;Plataforma de voos sem taxa de serviço cresce 300% e mira expansão latino-americana&rdquo;
              </p>
              <p className="font-sans text-xs text-ink-500 mt-2">Finanças Pessoais</p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-2">Startups.com.br</p>
              <p className="font-serif text-sm font-bold text-white leading-snug">
                &ldquo;maisumvoo entra na lista das 10 startups de viagens mais promissoras de 2025&rdquo;
              </p>
              <p className="font-sans text-xs text-ink-500 mt-2">Ecossistema de Inovação</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
