import Link from "next/link";

export default function CarreirasPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Trabalhe conosco</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Carreiras</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">
            Times pequenos, impacto direto e liberdade para construir produtos que importam.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-4">Nossa cultura</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Na maisumvoo, acreditamos que os melhores produtos são construídos por pessoas que têm autonomia para pensar e agir. Não há burocracia, não há camadas intermináveis de aprovação — apenas pessoas talentosas trabalhando em problemas reais.
              </p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Somos um time 100% remoto, distribuído entre São Paulo, Recife, Florianópolis e Belo Horizonte. A distância física nunca foi barreira para construirmos algo coeso e com propósito.
              </p>
            </div>
            <div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Cada pessoa no time tem visibilidade direta do impacto do seu trabalho. Um engenheiro que otimiza a busca de voos vê os resultados em tempo real no volume de reservas. Um designer que melhora o checkout sente o reflexo nos números de conversão.
              </p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Buscamos pessoas curiosas, que questionam premissas e que preferem construir soluções simples a sistemas complexos.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Vagas abertas</p>
          <div className="space-y-3">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-serif text-base font-bold text-white mb-1">Engenheiro Frontend Sênior</p>
                  <div className="flex flex-wrap gap-4">
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">Tecnologia</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">Remoto</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">PJ</span>
                  </div>
                </div>
                <a
                  href="mailto:careers@maisumvoo.com.br?subject=Engenheiro Frontend Sênior"
                  className="font-sans text-xs uppercase tracking-widest text-gold border border-ink-700 px-4 py-2 hover:border-gold transition-colors whitespace-nowrap"
                >
                  Candidatar-se
                </a>
              </div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
                Next.js, TypeScript e experiência com sistemas de busca em tempo real. Você vai liderar a evolução do nosso produto principal.
              </p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-serif text-base font-bold text-white mb-1">Engenheiro de Dados</p>
                  <div className="flex flex-wrap gap-4">
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">Dados</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">Remoto</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">CLT ou PJ</span>
                  </div>
                </div>
                <a
                  href="mailto:careers@maisumvoo.com.br?subject=Engenheiro de Dados"
                  className="font-sans text-xs uppercase tracking-widest text-gold border border-ink-700 px-4 py-2 hover:border-gold transition-colors whitespace-nowrap"
                >
                  Candidatar-se
                </a>
              </div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
                Pipeline de dados de tarifas aéreas, modelagem preditiva de preços e dashboards operacionais. Stack: Python, dbt, BigQuery.
              </p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-serif text-base font-bold text-white mb-1">Designer de Produto</p>
                  <div className="flex flex-wrap gap-4">
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">Design</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">Híbrido — São Paulo</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">CLT</span>
                  </div>
                </div>
                <a
                  href="mailto:careers@maisumvoo.com.br?subject=Designer de Produto"
                  className="font-sans text-xs uppercase tracking-widest text-gold border border-ink-700 px-4 py-2 hover:border-gold transition-colors whitespace-nowrap"
                >
                  Candidatar-se
                </a>
              </div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
                Pesquisa com usuário, prototipação e execução visual. Você vai trabalhar lado a lado com engenharia e produto para definir cada detalhe da experiência.
              </p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-serif text-base font-bold text-white mb-1">Especialista em Parcerias Comerciais</p>
                  <div className="flex flex-wrap gap-4">
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">Comercial</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">São Paulo</span>
                    <span className="font-sans text-xs text-ink-500 uppercase tracking-widest">CLT</span>
                  </div>
                </div>
                <a
                  href="mailto:careers@maisumvoo.com.br?subject=Especialista em Parcerias Comerciais"
                  className="font-sans text-xs uppercase tracking-widest text-gold border border-ink-700 px-4 py-2 hover:border-gold transition-colors whitespace-nowrap"
                >
                  Candidatar-se
                </a>
              </div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
                Negociação de acordos com companhias aéreas e agências de viagem. Experiência no mercado de aviação ou turismo é diferencialda.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Benefícios</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-ink-800 bg-ink-900 p-5 flex gap-4 items-start">
              <div className="w-1 h-full bg-gold flex-shrink-0 self-stretch" style={{ minHeight: "16px" }}></div>
              <div>
                <p className="font-sans text-sm font-medium text-white mb-1">Plano de saúde e odontológico</p>
                <p className="font-sans text-xs text-ink-400 leading-relaxed">Cobertura nacional para titular e dependentes, sem coparticipação.</p>
              </div>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-5 flex gap-4 items-start">
              <div className="w-1 h-full bg-gold flex-shrink-0 self-stretch" style={{ minHeight: "16px" }}></div>
              <div>
                <p className="font-sans text-sm font-medium text-white mb-1">Horário flexível</p>
                <p className="font-sans text-xs text-ink-400 leading-relaxed">Sem marcação de ponto. Entregamos resultados, não horas na cadeira.</p>
              </div>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-5 flex gap-4 items-start">
              <div className="w-1 h-full bg-gold flex-shrink-0 self-stretch" style={{ minHeight: "16px" }}></div>
              <div>
                <p className="font-sans text-sm font-medium text-white mb-1">Home office permanente</p>
                <p className="font-sans text-xs text-ink-400 leading-relaxed">Auxílio mensal para montar e manter seu escritório em casa.</p>
              </div>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-5 flex gap-4 items-start">
              <div className="w-1 h-full bg-gold flex-shrink-0 self-stretch" style={{ minHeight: "16px" }}></div>
              <div>
                <p className="font-sans text-sm font-medium text-white mb-1">Stock options</p>
                <p className="font-sans text-xs text-ink-400 leading-relaxed">Participação no crescimento da empresa com vesting de 4 anos.</p>
              </div>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-5 flex gap-4 items-start">
              <div className="w-1 h-full bg-gold flex-shrink-0 self-stretch" style={{ minHeight: "16px" }}></div>
              <div>
                <p className="font-sans text-sm font-medium text-white mb-1">Budget de aprendizado</p>
                <p className="font-sans text-xs text-ink-400 leading-relaxed">R$ 3.000 por ano para cursos, livros, conferências e certificações.</p>
              </div>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-5 flex gap-4 items-start">
              <div className="w-1 h-full bg-gold flex-shrink-0 self-stretch" style={{ minHeight: "16px" }}></div>
              <div>
                <p className="font-sans text-sm font-medium text-white mb-1">Passagens com desconto</p>
                <p className="font-sans text-xs text-ink-400 leading-relaxed">Acesso à plataforma com tarifa preferencial para viagens pessoais.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-ink-800 bg-ink-900 p-8">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Não encontrou a vaga ideal?</p>
          <p className="font-serif text-xl font-bold text-white mb-3">Envie seu currículo</p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4 max-w-lg">
            Estamos sempre abertos a conhecer pessoas talentosas. Envie seu portfólio ou currículo e nos conte o que você gostaria de construir aqui.
          </p>
          <a
            href="mailto:careers@maisumvoo.com.br"
            className="inline-block font-sans text-xs uppercase tracking-widest text-gold border border-gold px-6 py-3 hover:bg-gold hover:text-ink-950 transition-colors"
          >
            careers@maisumvoo.com.br
          </a>
        </div>
      </div>
    </div>
  );
}
