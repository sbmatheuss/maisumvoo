import Link from "next/link";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Empresa</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Sobre nós</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">
            Simplificamos a compra de passagens aéreas no Brasil — sem taxas ocultas, sem complicação.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-4">Nossa história</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Fundada em 2023, a maisumvoo nasceu da frustração com a complexidade e as taxas abusivas do mercado de passagens aéreas brasileiro. Nossos fundadores, viajantes frequentes, decidiram construir a plataforma que gostariam de ter usado.
              </p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Em menos de dois anos, nos tornamos uma das plataformas de busca de voos mais transparentes do país, com zero taxa de serviço e uma experiência de compra descomplicada do início ao fim.
              </p>
            </div>
            <div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Operamos com uma filosofia simples: o viajante merece clareza. Cada tarifa exibida é a tarifa real. Cada assento selecionado é o assento que você vai ocupar. Nenhuma surpresa no checkout.
              </p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Hoje conectamos brasileiros a destinos em todo o país, com tecnologia desenvolvida internamente para garantir as melhores tarifas em tempo real.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Números de impacto</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-serif text-3xl font-bold text-gold mb-1">3</p>
              <p className="font-sans text-xs text-ink-400 uppercase tracking-widest">Anos no mercado</p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-serif text-3xl font-bold text-gold mb-1">+180k</p>
              <p className="font-sans text-xs text-ink-400 uppercase tracking-widest">Passageiros atendidos</p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-serif text-3xl font-bold text-gold mb-1">47</p>
              <p className="font-sans text-xs text-ink-400 uppercase tracking-widest">Destinos nacionais</p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-serif text-3xl font-bold text-gold mb-1">0%</p>
              <p className="font-sans text-xs text-ink-400 uppercase tracking-widest">Taxa de serviço</p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Missão, visão e valores</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-3">Missão</p>
              <p className="font-serif text-lg font-bold text-white mb-3">Democratizar o acesso ao transporte aéreo</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Tornar a compra de passagens aéreas simples, justa e acessível para todo brasileiro, eliminando intermediários e taxas desnecessárias.
              </p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-3">Visão</p>
              <p className="font-serif text-lg font-bold text-white mb-3">Ser a plataforma de viagens mais confiável do Brasil</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Referência em transparência, tecnologia e experiência do usuário no mercado de aviação civil brasileiro até 2027.
              </p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-3">Valores</p>
              <p className="font-serif text-lg font-bold text-white mb-3">Transparência acima de tudo</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Honestidade com o cliente, responsabilidade com os dados, impacto positivo nas comunidades que atendemos e obsessão pela simplicidade.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Nossa equipe</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-1">Co-fundador e CEO</p>
              <p className="font-serif text-lg font-bold text-white mb-2">Ricardo Alencar</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Ex-engenheiro da Embraer com 12 anos no setor aeronáutico. Lidera a estratégia de produto e as parcerias com companhias aéreas.
              </p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-1">Co-fundadora e CTO</p>
              <p className="font-serif text-lg font-bold text-white mb-2">Fernanda Castilho</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Formada em Ciência da Computação pela USP, construiu sistemas de busca em tempo real em duas startups de logística antes de fundar a maisumvoo.
              </p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-1">Head de Design</p>
              <p className="font-serif text-lg font-bold text-white mb-2">Thiago Menezes</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Designer com passagem por agências de São Paulo e Lisboa. Responsável pela identidade visual e pela experiência de compra end-to-end.
              </p>
            </div>
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-1">Head de Operações</p>
              <p className="font-serif text-lg font-bold text-white mb-2">Camila Rocha</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                MBA em Administração pela FGV, especialista em operações de marketplace. Garante que cada reserva seja processada com máxima eficiência.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
