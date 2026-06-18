export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Legal</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Política de Cookies</h1>
          <p className="font-sans text-ink-500 text-xs mt-3">Última atualização: 1 de janeiro de 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">1. O que são Cookies</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles permitem que a plataforma reconheça o seu navegador, lembre de suas preferências e melhore a sua experiência de navegação ao longo das visitas.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Os cookies não contêm vírus, não executam programas e não acessam informações armazenadas no seu dispositivo além do que foi originalmente gravado por eles. A maioria dos navegadores aceita cookies automaticamente, mas você pode configurar o seu navegador para recusá-los total ou parcialmente.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">2. Cookies que Utilizamos</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6">
            A tabela abaixo descreve os cookies utilizados pelo maisumvoo, suas finalidades e duração.
          </p>

          <div className="space-y-0" style={{ borderRadius: "2px" }}>
            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-900 px-3 py-2">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Tipo</p>
              </div>
              <div className="bg-ink-900 px-3 py-2">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Nome</p>
              </div>
              <div className="bg-ink-900 px-3 py-2">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Finalidade</p>
              </div>
              <div className="bg-ink-900 px-3 py-2">
                <p className="font-sans text-xs uppercase tracking-widest text-ink-400">Duração</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Essencial</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">session_id</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Mantém a sessão do usuário autenticado</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Sessão</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Essencial</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">cart_token</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Preserva os dados da reserva em andamento</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Sessão</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Essencial</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">auth_token</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Mantém o usuário autenticado entre visitas</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Sessão</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Funcional</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">mv_locale</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Armazena preferência de idioma e moeda</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">1 ano</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Analítico</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">_ga</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Google Analytics — identifica usuários únicos</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">2 anos</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Analítico</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">_ga_*</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Google Analytics — estado da sessão</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">2 anos</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Marketing</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">mv_price_alert</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Rotas monitoradas para alertas de preço</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">90 dias</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-ink-800">
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-white">Marketing</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400 font-mono">mv_rmkt</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">Remarketing — buscas e destinos visitados</p>
              </div>
              <div className="bg-ink-950 px-3 py-3">
                <p className="font-sans text-xs text-ink-400">90 dias</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">3. Como Gerenciar Cookies</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-5">
            Você pode controlar e gerenciar cookies diretamente nas configurações do seu navegador. Veja as instruções para os principais navegadores:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Google Chrome</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Acesse Configurações, clique em Privacidade e segurança, depois em Cookies e outros dados do site. Ali você pode bloquear ou excluir cookies por categoria.</p>
            </div>
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Mozilla Firefox</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Acesse Preferências, clique em Privacidade e Segurança. Na seção Cookies e dados do site, você pode gerenciar permissões e excluir cookies armazenados.</p>
            </div>
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Apple Safari</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Acesse Preferências, clique em Privacidade. Você pode bloquear todos os cookies ou apenas os de terceiros, além de gerenciar dados armazenados por site.</p>
            </div>
            <div className="border-l-2 border-ink-700 pl-4">
              <p className="font-sans text-sm text-white mb-1">Microsoft Edge</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Acesse Configurações, clique em Cookies e permissões do site. Ali você define o nível de bloqueio de rastreamento e pode excluir cookies individualmente por domínio.</p>
            </div>
          </div>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-5">
            A desativação de cookies essenciais pode prejudicar o funcionamento da plataforma, impedindo, por exemplo, a conclusão de reservas ou o acesso a áreas autenticadas.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">4. Cookies de Terceiros</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Alguns cookies presentes na plataforma são definidos por serviços de terceiros com os quais operamos. A <span className="text-white">Stripe</span> utiliza cookies necessários para garantir a segurança e o funcionamento correto do processamento de pagamentos, incluindo a detecção de fraudes e a verificação de identidade do portador do cartão.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            O <span className="text-white">Google Analytics</span> utiliza cookies para coletar informações sobre como os visitantes utilizam o site, gerando relatórios agregados e anônimos que nos ajudam a melhorar a experiência da plataforma. O Google pode utilizar esses dados conforme sua própria política de privacidade, disponível em policies.google.com. Você pode optar por não participar do rastreamento do Google Analytics instalando o complemento de exclusão disponível em tools.google.com/dlpage/gaoptout.
          </p>
        </section>

        <section className="pb-8">
          <h2 className="font-serif text-xl text-white mb-4">5. Alterações nesta Política</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Reservamo-nos o direito de atualizar esta Política de Cookies a qualquer momento, especialmente em razão de mudanças nas tecnologias que utilizamos, em nossas práticas de negócio ou em exigências legais e regulatórias. A data da última atualização é sempre indicada no topo desta página.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Recomendamos que você revise esta política periodicamente. O uso continuado da plataforma após a publicação de alterações constitui sua aceitação das novas condições. Em caso de dúvidas, entre em contato pelo e-mail <span className="text-gold">privacidade@maisumvoo.com.br</span>.
          </p>
        </section>

      </div>
    </div>
  );
}
