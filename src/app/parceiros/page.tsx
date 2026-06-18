import Link from "next/link";

export default function ParceirosPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Programa</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Parceiros</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">
            Trabalhe conosco para oferecer as melhores tarifas aéreas ao maior número de viajantes.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-4">Por que ser parceiro</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                A maisumvoo conecta diariamente dezenas de milhares de viajantes com as melhores tarifas disponíveis no mercado. Ao se tornar nosso parceiro, você ganha acesso a uma base de usuários qualificada, com alta intenção de compra.
              </p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Nossa plataforma é construída sobre APIs abertas e documentação técnica robusta, permitindo integrações rápidas e confiáveis. Temos experiência em operar com diferentes tipos de parceiros — desde companhias aéreas até corporações com programas de viagens de alto volume.
              </p>
            </div>
            <div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Acreditamos que a melhor tarifa só existe quando há uma cadeia de distribuição eficiente e transparente. Por isso, construímos relações de parceria de longo prazo, com contratos claros, SLAs definidos e suporte técnico dedicado.
              </p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Não cobramos taxas de setup. Nossa remuneração é baseada em performance — crescemos quando nossos parceiros crescem.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Tipos de parceria</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-3">Companhias Aéreas</p>
              <p className="font-serif text-lg font-bold text-white mb-3">Integração de inventário</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Conecte seu inventário de assentos diretamente à nossa plataforma de busca. Oferecemos integração via NDC e EDIFACT, com distribuição das suas tarifas em tempo real para todos os nossos usuários.
              </p>
              <ul className="space-y-2">
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Integração NDC nível 4</span>
                </li>
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Ancillaries e upgrades</span>
                </li>
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Relatórios de performance</span>
                </li>
              </ul>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-3">Agências de Viagem</p>
              <p className="font-serif text-lg font-bold text-white mb-3">API de busca e reserva</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Acesse nossa API de busca e incorpore os resultados da maisumvoo ao seu sistema de reservas. Documentação completa, ambiente sandbox e suporte técnico incluso.
              </p>
              <ul className="space-y-2">
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>REST API com OAuth 2.0</span>
                </li>
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Sandbox e webhooks</span>
                </li>
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Comissões competitivas</span>
                </li>
              </ul>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-gold mb-3">Empresas Corporativas</p>
              <p className="font-serif text-lg font-bold text-white mb-3">Gestão de viagens</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">
                Solução completa para gestão de viagens corporativas: política de viagens configurável, centros de custo, aprovações e relatórios consolidados para o RH e o financeiro.
              </p>
              <ul className="space-y-2">
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Portal corporativo dedicado</span>
                </li>
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Política de viagens customizável</span>
                </li>
                <li className="font-sans text-xs text-ink-500 flex gap-2 items-start">
                  <span className="text-gold mt-0.5">—</span>
                  <span>Fatura mensal unificada</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-6">Como se tornar parceiro</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-2xl font-bold text-gold">01</span>
                <div className="flex-1 h-px bg-ink-800"></div>
              </div>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Candidatura</p>
              <p className="font-serif text-base font-bold text-white mb-3">Apresente sua empresa</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Envie um email para parceiros@maisumvoo.com.br com uma apresentação da sua empresa, tipo de parceria desejado e volume estimado de operação.
              </p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-2xl font-bold text-gold">02</span>
                <div className="flex-1 h-px bg-ink-800"></div>
              </div>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Análise</p>
              <p className="font-serif text-base font-bold text-white mb-3">Avaliação e proposta</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Nossa equipe comercial analisa o perfil e entra em contato em até 5 dias úteis com uma proposta detalhada, incluindo condições técnicas e comerciais.
              </p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-2xl font-bold text-gold">03</span>
                <div className="flex-1 h-px bg-ink-800"></div>
              </div>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Integração</p>
              <p className="font-serif text-base font-bold text-white mb-3">Implementação técnica</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                Com o contrato assinado, nosso time de engenharia conduz a integração técnica, com testes em sandbox e homologação antes de ir para produção.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-ink-800 bg-ink-900 p-8">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Pronto para começar?</p>
          <p className="font-serif text-xl font-bold text-white mb-3">Entre em contato com nosso time comercial</p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6 max-w-lg">
            Responderemos em até 2 dias úteis com todas as informações necessárias para avançarmos juntos. Sem compromisso na primeira conversa.
          </p>
          <a
            href="mailto:parceiros@maisumvoo.com.br"
            className="inline-block font-sans text-xs uppercase tracking-widest text-gold border border-gold px-6 py-3 hover:bg-gold hover:text-ink-950 transition-colors"
          >
            parceiros@maisumvoo.com.br
          </a>
        </div>
      </div>
    </div>
  );
}
