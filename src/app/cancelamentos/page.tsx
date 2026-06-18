import Link from "next/link";

export default function CancelamentosPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Suporte</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Política de Cancelamento</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">Entenda como funciona o processo de cancelamento, prazos e seus direitos como passageiro.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Como cancelar</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-8">O cancelamento pode ser solicitado diretamente pela plataforma maisumvoo em três passos simples.</p>

          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 border border-gold flex items-center justify-center" style={{ borderRadius: "2px" }}>
                <span className="font-sans text-sm text-gold font-medium">1</span>
              </div>
              <div>
                <p className="font-sans text-sm text-white font-medium mb-1">Acesse Minhas Viagens</p>
                <p className="font-sans text-sm text-ink-400 leading-relaxed">Entre na sua conta e acesse a seção Minhas Viagens no menu principal. Localize a reserva que deseja cancelar pelo número do localizador ou data do voo.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 border border-gold flex items-center justify-center" style={{ borderRadius: "2px" }}>
                <span className="font-sans text-sm text-gold font-medium">2</span>
              </div>
              <div>
                <p className="font-sans text-sm text-white font-medium mb-1">Solicite o cancelamento</p>
                <p className="font-sans text-sm text-ink-400 leading-relaxed">Clique em Cancelar reserva e revise as condições aplicáveis à sua tarifa. O sistema exibirá o valor do reembolso estimado antes de confirmar a ação.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 border border-gold flex items-center justify-center" style={{ borderRadius: "2px" }}>
                <span className="font-sans text-sm text-gold font-medium">3</span>
              </div>
              <div>
                <p className="font-sans text-sm text-white font-medium mb-1">Confirme e aguarde</p>
                <p className="font-sans text-sm text-ink-400 leading-relaxed">Confirme o cancelamento e guarde o número de protocolo enviado para seu e-mail. O reembolso será processado conforme os prazos indicados na política de reembolso.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Prazos e condições</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6">As condições de reembolso variam conforme o prazo do cancelamento em relação ao horário do voo.</p>

          <div className="border border-ink-800" style={{ borderRadius: "2px" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800 bg-ink-900">
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Prazo de cancelamento</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Reembolso</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Taxa administrativa</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Até 24 horas após a compra (desde que o voo seja em mais de 7 dias)</td>
                  <td className="font-sans text-sm text-gold px-6 py-4">Reembolso integral</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Isento</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Mais de 72 horas antes do voo</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Reembolso integral</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Conforme tarifa</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Entre 24h e 72h antes do voo</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Reembolso de 75%</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">25% do valor pago</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Entre 2h e 24h antes do voo</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Reembolso de 50%</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">50% do valor pago</td>
                </tr>
                <tr>
                  <td className="font-sans text-sm text-white px-6 py-4">Menos de 2h antes do voo</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Sem reembolso</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">100% do valor pago</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-sans text-xs text-ink-500 mt-4">As condições acima aplicam-se a tarifas padrão. Tarifas promocionais podem ter regras mais restritivas descritas no momento da compra.</p>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Cancelamentos por companhia aérea</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">Quando o cancelamento é iniciado pela companhia aérea, seus direitos como passageiro são garantidos pela Resolução ANAC 400/2016 e pelo Código de Defesa do Consumidor.</p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-4">Em caso de cancelamento pela companhia, você tem direito a escolher entre as seguintes alternativas sem custo adicional:</p>

          <div className="space-y-4 mb-6">
            <div className="border border-ink-800 bg-ink-900 p-5" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-sm text-white font-medium mb-1">Reembolso integral</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Devolução do valor total pago pelo bilhete, incluindo taxas, sem qualquer desconto ou penalidade.</p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-5" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-sm text-white font-medium mb-1">Realocação em outro voo</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Embarque em outro voo da mesma companhia para o mesmo destino, sem cobrança de diferença tarifária, na primeira disponibilidade ou em data de sua preferência.</p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-5" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-sm text-white font-medium mb-1">Crédito para uso futuro</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Conversão do valor do bilhete em crédito para uso em compras futuras com a mesma companhia, com validade mínima de 12 meses.</p>
            </div>
          </div>

          <p className="font-sans text-sm text-ink-400 leading-relaxed">Se o cancelamento ocorrer com menos de 72 horas de antecedência e causar impacto em sua viagem, a companhia deve oferecer também assistência material, incluindo comunicação, alimentação e, se necessário, hospedagem.</p>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-4">Cancelar minha reserva</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mb-6">Para iniciar o processo de cancelamento, acesse a seção Minhas Viagens e siga as instruções na tela.</p>
          <Link
            href="/minhas-viagens"
            className="font-sans text-sm border border-gold text-gold px-6 py-3 inline-block hover:bg-gold hover:text-ink-950 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            Acessar Minhas Viagens
          </Link>
        </div>

        <div className="pb-10">
          <p className="font-sans text-xs text-ink-500 leading-relaxed">As políticas descritas nesta página são aplicáveis a reservas realizadas diretamente pelo maisumvoo. Para bilhetes adquiridos por outros canais, consulte a política da companhia aérea ou agência de origem. As regras podem variar conforme a tarifa, rota e companhia aérea. O maisumvoo atua como intermediário e não é responsável por políticas individuais das operadoras aéreas. Em caso de dúvidas, entre em contato com nosso suporte antes de solicitar o cancelamento.</p>
        </div>

      </div>
    </div>
  );
}
