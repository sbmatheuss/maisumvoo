import Link from "next/link";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Legal</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Termos de Uso</h1>
          <p className="font-sans text-ink-500 text-xs mt-3">Última atualização: 1 de janeiro de 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">1. Aceitação dos Termos</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Ao acessar e utilizar o site maisumvoo, você concorda expressamente com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde com qualquer disposição aqui prevista, solicitamos que interrompa imediatamente o uso da plataforma.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Estes termos podem ser atualizados periodicamente, e o uso continuado da plataforma após quaisquer alterações constitui aceitação das novas condições. Recomendamos que você revise este documento regularmente.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">2. Descrição do Serviço</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            O maisumvoo é uma plataforma digital de busca, comparação e intermediação de passagens aéreas. Não somos uma companhia aérea nem um operador de transporte: atuamos como canal de distribuição, conectando passageiros às companhias aéreas parceiras.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            As tarifas, disponibilidade de assentos e condições de viagem são definidas pelas próprias companhias aéreas. O maisumvoo não possui controle sobre horários, rotas, cancelamentos ou políticas operacionais das transportadoras.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">3. Cadastro e Conta</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Para utilizar determinadas funcionalidades da plataforma, como o acompanhamento de reservas e alertas de preço, é necessário criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Ao se cadastrar, você declara que as informações fornecidas são verdadeiras, completas e atualizadas. O fornecimento de dados falsos ou incorretos pode acarretar o cancelamento da conta e das reservas associadas, sem direito a reembolso das tarifas não reembolsáveis.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">4. Reservas e Pagamentos</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Ao concluir uma reserva na plataforma, você receberá uma confirmação por e-mail com o localizador do bilhete e os detalhes do voo. A confirmação da reserva está condicionada à aprovação do pagamento e à disponibilidade do assento no momento da emissão.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Aceitamos pagamentos via cartão de crédito, cartão de débito e Pix, processados com segurança pela Stripe. Os preços exibidos incluem taxas de embarque e encargos obrigatórios, salvo indicação expressa em contrário na tela de checkout.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">5. Cancelamentos e Alterações</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            As condições de cancelamento e alteração de reservas variam conforme a tarifa adquirida e a política de cada companhia aérea. Algumas tarifas são integralmente não reembolsáveis; outras permitem cancelamento com cobrança de multa ou sem ônus dentro de determinado prazo.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Para solicitar cancelamentos ou alterações, acesse a seção <Link href="/minhas-viagens" className="text-gold underline underline-offset-2">Minhas Viagens</Link> ou entre em contato com nosso suporte. Consulte nossa Política de Cancelamento completa para mais detalhes sobre prazos e procedimentos.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">6. Responsabilidade</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            O maisumvoo não se responsabiliza por atrasos, cancelamentos, mudanças de itinerário, extravio de bagagem ou quaisquer outros incidentes operacionais de responsabilidade das companhias aéreas. Nesses casos, os direitos do passageiro devem ser exercidos diretamente junto à transportadora ou perante a ANAC.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Nossa responsabilidade se limita ao valor efetivamente pago pelo usuário pelos serviços de intermediação prestados pelo maisumvoo, excluídos os valores de tarifa transferidos às companhias aéreas. Não somos responsáveis por danos indiretos, lucros cessantes ou danos morais decorrentes de falhas operacionais das transportadoras.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">7. Propriedade Intelectual</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Todo o conteúdo disponível na plataforma maisumvoo — incluindo textos, logotipos, design, código-fonte, imagens e funcionalidades — é protegido por direitos autorais e demais normas de propriedade intelectual vigentes no Brasil. É vedada a reprodução, distribuição ou utilização comercial de qualquer elemento sem autorização prévia e expressa.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            O uso não autorizado do conteúdo desta plataforma pode configurar violação de direitos autorais e será tratado na forma da lei, incluindo medidas judiciais cabíveis. Para solicitações de licenciamento ou parcerias, entre em contato através do e-mail legal@maisumvoo.com.br.
          </p>
        </section>

        <section className="pb-8">
          <h2 className="font-serif text-xl text-white mb-4">8. Disposições Gerais</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Para dirimir eventuais controvérsias decorrentes deste instrumento, as partes elegem o foro da Comarca de São Paulo — SP, com exclusão de qualquer outro, por mais privilegiado que seja.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Para dúvidas, solicitações ou comunicações relacionadas a estes termos, entre em contato pelo e-mail <span className="text-gold">legal@maisumvoo.com.br</span>. Nosso time jurídico retornará o contato em até 5 dias úteis.
          </p>
        </section>

      </div>
    </div>
  );
}
