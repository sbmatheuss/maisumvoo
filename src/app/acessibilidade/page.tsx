export default function AcessibilidadePage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Legal</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Declaração de Acessibilidade</h1>
          <p className="font-sans text-ink-500 text-xs mt-3">Última atualização: 1 de janeiro de 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">1. Nosso Compromisso</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            O maisumvoo está comprometido em garantir a acessibilidade digital para todas as pessoas, independentemente de suas capacidades ou das tecnologias assistivas que utilizam. Acreditamos que viajar é um direito de todos, e que a experiência de planejar e comprar passagens deve ser igualmente acessível a cada usuário.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Trabalhamos continuamente para identificar e eliminar barreiras digitais em nossa plataforma, envolvendo usuários com deficiência em nossos processos de teste e revisão. A acessibilidade não é um projeto pontual, mas uma prática permanente integrada ao nosso ciclo de desenvolvimento.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">2. Padrões Seguidos</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            A plataforma maisumvoo busca conformidade com as <span className="text-white">Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1, nível AA</span>, publicadas pelo World Wide Web Consortium (W3C). Essas diretrizes estabelecem critérios técnicos para tornar o conteúdo web perceptível, operável, compreensível e robusto para o maior número possível de usuários.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            No contexto brasileiro, seguimos também as recomendações do <span className="text-white">Modelo de Acessibilidade em Governo Eletrônico (eMAG)</span>, elaborado pelo governo federal para orientar o desenvolvimento de sites e aplicações acessíveis. A conformidade com o eMAG nos auxilia a atender às especificidades do público brasileiro e às normas da legislação nacional, incluindo a Lei Brasileira de Inclusão (Lei n.º 13.146/2015).
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">3. Recursos de Acessibilidade</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-5">
            A plataforma incorpora os seguintes recursos para ampliar a acessibilidade:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Compatibilidade com leitores de tela</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Todos os elementos interativos possuem rótulos ARIA adequados, garantindo que leitores de tela consigam descrever o conteúdo e as ações disponíveis com precisão.</p>
            </div>
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Contraste adequado</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">O design da plataforma utiliza combinações de cores com razão de contraste de no mínimo 4,5:1 para texto normal e 3:1 para texto grande, conforme exigido pelo critério WCAG 1.4.3.</p>
            </div>
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Navegação por teclado</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Toda a plataforma pode ser operada exclusivamente pelo teclado, sem necessidade de mouse. A ordem de foco dos elementos é lógica e consistente, e os indicadores de foco são sempre visíveis.</p>
            </div>
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Textos alternativos em imagens</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Todas as imagens informativas possuem texto alternativo descritivo. Imagens decorativas são marcadas de forma a serem ignoradas pelos leitores de tela, evitando ruídos desnecessários na navegação.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">4. Limitações Conhecidas</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Embora nos esforcemos para atingir a conformidade total com WCAG 2.1 nível AA, algumas funcionalidades da plataforma podem não estar totalmente otimizadas para todas as tecnologias assistivas. Em particular, o fluxo de seleção de assentos e determinados componentes de calendário para escolha de datas podem apresentar limitações de navegação por teclado e compatibilidade com leitores de tela mais antigos.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Estamos ativamente trabalhando para resolver essas limitações em nossas próximas versões. Priorizamos correções com base nos relatos recebidos pelos nossos usuários, e cada atualização da plataforma inclui melhorias de acessibilidade. Agradecemos a paciência e os relatos que nos ajudam a evoluir.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">5. Feedback e Contato</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Valorizamos o retorno de nossos usuários sobre barreiras de acessibilidade encontradas na plataforma. Se você identificou um problema, tem dificuldade em acessar qualquer funcionalidade ou deseja sugerir melhorias, entre em contato conosco pelos canais abaixo.
          </p>
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 mt-2 bg-gold flex-shrink-0" style={{ borderRadius: "2px" }}></div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                <span className="text-white">E-mail: </span>
                <span className="text-gold">acessibilidade@maisumvoo.com.br</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 mt-2 bg-gold flex-shrink-0" style={{ borderRadius: "2px" }}></div>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">
                <span className="text-white">Telefone (gratuito): </span>
                0800 000 1234 — disponível de segunda a sexta, das 8h às 18h
              </p>
            </div>
          </div>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-5">
            Nos comprometemos a responder todas as solicitações de acessibilidade em até 2 dias úteis e a comunicar o prazo estimado para a resolução de problemas reportados.
          </p>
        </section>

        <section className="pb-8">
          <h2 className="font-serif text-xl text-white mb-4">6. Tecnologias Assistivas Testadas</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-5">
            A plataforma maisumvoo é testada regularmente com as seguintes tecnologias assistivas para garantir a compatibilidade:
          </p>
          <div className="grid grid-cols-1 gap-px bg-ink-800" style={{ borderRadius: "2px" }}>
            <div className="grid grid-cols-3 gap-px bg-ink-800">
              <div className="bg-ink-900 px-3 py-2">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Tecnologia</p>
              </div>
              <div className="bg-ink-900 px-3 py-2">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Plataforma</p>
              </div>
              <div className="bg-ink-900 px-3 py-2">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Navegador</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-white">NVDA</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">Windows</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">Chrome, Firefox</p></div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-white">JAWS</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">Windows</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">Chrome, Edge</p></div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-white">VoiceOver</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">macOS e iOS</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">Safari</p></div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-white">TalkBack</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">Android</p></div>
              <div className="bg-ink-950 px-3 py-3"><p className="font-sans text-xs text-ink-400">Chrome</p></div>
            </div>
          </div>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-5">
            Os testes são realizados em conjunto com avaliadores com deficiência visual e motora, garantindo que as validações reflitam cenários de uso reais. Caso utilize uma tecnologia assistiva não listada e encontre dificuldades, relate para que possamos incluí-la em nossa matriz de testes.
          </p>
        </section>

      </div>
    </div>
  );
}
