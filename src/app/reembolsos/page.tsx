import Link from "next/link";

export default function ReembolsosPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Suporte</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Política de Reembolso</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">Saiba os prazos, como solicitar e acompanhar o status do seu reembolso.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Prazo de reembolso</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6">O prazo para devolução do valor varia conforme o método de pagamento utilizado na compra. Todos os prazos são contados a partir da confirmação do cancelamento.</p>

          <div className="border border-ink-800" style={{ borderRadius: "2px" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800 bg-ink-900">
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Método de pagamento</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Prazo estimado</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Cartão de crédito</td>
                  <td className="font-sans text-sm text-gold px-6 py-4">5 a 7 dias úteis</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">O estorno aparece na fatura seguinte ou subsequente, conforme a data de fechamento.</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">PIX</td>
                  <td className="font-sans text-sm text-gold px-6 py-4">1 a 2 dias úteis</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">O reembolso é feito para a mesma chave PIX utilizada no pagamento.</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Boleto bancário</td>
                  <td className="font-sans text-sm text-gold px-6 py-4">3 a 5 dias úteis</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">É necessário informar uma conta bancária para receber o valor.</td>
                </tr>
                <tr>
                  <td className="font-sans text-sm text-white px-6 py-4">Crédito na plataforma</td>
                  <td className="font-sans text-sm text-gold px-6 py-4">Imediato</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Disponível para uso em novas reservas assim que o cancelamento for confirmado.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-sans text-xs text-ink-500 mt-4">Os prazos indicados referem-se ao processamento pelo maisumvoo. A disponibilidade dos valores na conta do cliente pode variar conforme a instituição financeira.</p>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Como solicitar reembolso</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-8">Siga os passos abaixo para solicitar o reembolso de uma reserva cancelada.</p>

          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 border border-gold flex items-center justify-center" style={{ borderRadius: "2px" }}>
                <span className="font-sans text-sm text-gold font-medium">1</span>
              </div>
              <div>
                <p className="font-sans text-sm text-white font-medium mb-1">Cancele sua reserva</p>
                <p className="font-sans text-sm text-ink-400 leading-relaxed">Acesse Minhas Viagens e solicite o cancelamento da reserva. O reembolso é iniciado automaticamente após a confirmação do cancelamento, não sendo necessário abrir uma solicitação separada na maioria dos casos.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 border border-gold flex items-center justify-center" style={{ borderRadius: "2px" }}>
                <span className="font-sans text-sm text-gold font-medium">2</span>
              </div>
              <div>
                <p className="font-sans text-sm text-white font-medium mb-1">Informe os dados bancários (se necessário)</p>
                <p className="font-sans text-sm text-ink-400 leading-relaxed">Para pagamentos via boleto bancário, informe o banco, agência, número da conta e tipo (corrente ou poupança) para que possamos processar a transferência. Essa informação pode ser inserida durante o processo de cancelamento.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 border border-gold flex items-center justify-center" style={{ borderRadius: "2px" }}>
                <span className="font-sans text-sm text-gold font-medium">3</span>
              </div>
              <div>
                <p className="font-sans text-sm text-white font-medium mb-1">Aguarde a confirmação por e-mail</p>
                <p className="font-sans text-sm text-ink-400 leading-relaxed">Você receberá um e-mail de confirmação com o protocolo do cancelamento e as informações do reembolso, incluindo o valor aprovado e o prazo estimado para crédito.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 border border-gold flex items-center justify-center" style={{ borderRadius: "2px" }}>
                <span className="font-sans text-sm text-gold font-medium">4</span>
              </div>
              <div>
                <p className="font-sans text-sm text-white font-medium mb-1">Acompanhe o status</p>
                <p className="font-sans text-sm text-ink-400 leading-relaxed">O status do reembolso pode ser consultado a qualquer momento em Minhas Viagens. Caso o prazo seja ultrapassado sem crédito, entre em contato com nosso suporte informando o número do protocolo.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Casos especiais</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6">Em determinadas situações, o reembolso integral é garantido independentemente da tarifa adquirida.</p>

          <div className="space-y-4">
            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-sm text-white font-medium mb-2">Cancelamento pela companhia aérea</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Quando a companhia cancela o voo por qualquer motivo (operacional, clima, greve ou outros), o passageiro tem direito ao reembolso integral do bilhete, incluindo todas as taxas aeroportuárias e tarifas de serviço. O reembolso é processado no prazo padrão de cada método de pagamento.</p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-sm text-white font-medium mb-2">Overbooking</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Em casos de preterimento de embarque por overbooking, o passageiro tem direito ao reembolso integral e, conforme a Resolução ANAC 400/2016, a uma compensação financeira adicional. O maisumvoo auxilia na formalização da solicitação junto à companhia.</p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-sm text-white font-medium mb-2">Problemas técnicos na compra</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Se ocorrer falha técnica durante o processo de compra que resulte em cobrança sem a emissão do bilhete, o reembolso integral será processado em até 2 dias úteis após a confirmação do erro. Entre em contato com nosso suporte imediatamente com o comprovante de pagamento.</p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-sm text-white font-medium mb-2">Falecimento do passageiro ou familiar direto</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Mediante apresentação de certidão de óbito, é possível solicitar reembolso integral independentemente da tarifa. O pedido deve ser feito pelo suporte com a documentação necessária.</p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-4">Status do reembolso</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">Você pode acompanhar o andamento do seu reembolso diretamente pela plataforma. Acesse Minhas Viagens, localize a reserva cancelada e verifique o status na linha do tempo da reserva.</p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6">Os status possíveis são: Solicitado, Em processamento, Aprovado e Concluído. Uma notificação por e-mail é enviada a cada atualização.</p>

          <Link
            href="/minhas-viagens"
            className="font-sans text-sm border border-gold text-gold px-6 py-3 inline-block hover:bg-gold hover:text-ink-950 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            Ver status em Minhas Viagens
          </Link>
        </div>

        <div className="pb-10">
          <p className="font-sans text-xs text-ink-500 leading-relaxed">As políticas de reembolso descritas nesta página aplicam-se a reservas realizadas pelo maisumvoo. Tarifas promocionais e não-reembolsáveis estão sujeitas a condições específicas informadas no momento da compra. O maisumvoo não é responsável por atrasos nos créditos causados por instituições financeiras. Em caso de dúvidas, entre em contato com nosso suporte informando o número do protocolo de cancelamento.</p>
        </div>

      </div>
    </div>
  );
}
