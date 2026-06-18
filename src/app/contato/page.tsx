export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Suporte</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Fale Conosco</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">Entre em contato com nossa equipe de suporte pelo canal de sua preferência.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Canais de atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-3">Chat</p>
              <p className="font-serif text-lg text-white mb-2">Atendimento imediato</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Atendimento 24h via chat. Acesse pelo ícone no canto inferior direito da tela.</p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-3">E-mail</p>
              <p className="font-serif text-lg text-white mb-2">suporte@maisumvoo.com.br</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Respondemos em até 4 horas úteis. Para casos urgentes, prefira o chat.</p>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-6" style={{ borderRadius: "2px" }}>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-3">Telefone</p>
              <p className="font-serif text-lg text-white mb-2">0800 000 1234</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Segunda a sexta, das 8h às 20h. Ligação gratuita de qualquer operadora.</p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-6">Horários de atendimento</h2>
          <div className="border border-ink-800" style={{ borderRadius: "2px" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800 bg-ink-900">
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Dia</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Telefone</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">E-mail</th>
                  <th className="font-sans text-xs uppercase tracking-widest text-ink-400 text-left px-6 py-3">Chat</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Segunda a sexta</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">8h às 20h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">8h às 20h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Sábado</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">9h às 15h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">9h às 15h</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="font-sans text-sm text-white px-6 py-4">Domingo</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Fechado</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Respondemos na segunda</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
                <tr>
                  <td className="font-sans text-sm text-white px-6 py-4">Feriados nacionais</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Fechado</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">Respondemos no dia útil seguinte</td>
                  <td className="font-sans text-sm text-ink-400 px-6 py-4">24h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pb-10">
          <h2 className="font-serif text-xl text-white mb-6">Envie uma mensagem</h2>
          <p className="font-sans text-sm text-ink-400 mb-8 leading-relaxed">Preencha o formulário abaixo e nossa equipe entrará em contato em breve.</p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">Nome completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full bg-ink-900 border border-ink-800 text-white font-sans text-sm px-4 py-3 outline-none focus:border-ink-700 placeholder:text-ink-500"
                  style={{ borderRadius: "2px" }}
                />
              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-ink-900 border border-ink-800 text-white font-sans text-sm px-4 py-3 outline-none focus:border-ink-700 placeholder:text-ink-500"
                  style={{ borderRadius: "2px" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">CPF ou número de reserva</label>
                <input
                  type="text"
                  placeholder="000.000.000-00 ou MAV-000000"
                  className="w-full bg-ink-900 border border-ink-800 text-white font-sans text-sm px-4 py-3 outline-none focus:border-ink-700 placeholder:text-ink-500"
                  style={{ borderRadius: "2px" }}
                />
              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">Assunto</label>
                <select
                  className="w-full bg-ink-900 border border-ink-800 text-white font-sans text-sm px-4 py-3 outline-none focus:border-ink-700 appearance-none"
                  style={{ borderRadius: "2px" }}
                >
                  <option value="" className="text-ink-500">Selecione um assunto</option>
                  <option value="reserva">Dúvidas sobre reserva</option>
                  <option value="cancelamento">Cancelamento</option>
                  <option value="reembolso">Reembolso</option>
                  <option value="bagagem">Bagagem</option>
                  <option value="checkin">Check-in</option>
                  <option value="conta">Minha conta</option>
                  <option value="pagamento">Pagamento</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-ink-400 block mb-2">Mensagem</label>
              <textarea
                placeholder="Descreva sua dúvida ou solicitação com o máximo de detalhes possível."
                rows={6}
                className="w-full bg-ink-900 border border-ink-800 text-white font-sans text-sm px-4 py-3 outline-none focus:border-ink-700 placeholder:text-ink-500 resize-none"
                style={{ borderRadius: "2px" }}
              />
            </div>

            <div>
              <button
                type="submit"
                className="font-sans text-sm font-medium bg-gold text-ink-950 px-8 py-3 hover:opacity-90 transition-opacity"
                style={{ borderRadius: "2px" }}
              >
                Enviar mensagem
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
