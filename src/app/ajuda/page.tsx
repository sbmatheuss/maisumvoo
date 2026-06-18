import Link from "next/link";

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Suporte</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Central de Ajuda</h1>
          <p className="font-sans text-ink-400 text-sm mt-2 max-w-lg">Encontre respostas para as dúvidas mais comuns sobre reservas, bagagem, check-in e sua conta.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-4">Reservas</h2>

          <div className="space-y-6">
            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Como faço uma reserva?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Para realizar uma reserva, acesse a página inicial, informe a origem, destino, data de viagem e o número de passageiros. Clique em Buscar Voos, escolha o voo desejado e prossiga para o preenchimento dos dados dos passageiros. Após confirmar, você será redirecionado ao pagamento.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Posso alterar minha reserva?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Alterações de reserva estão sujeitas à disponibilidade e à política tarifária do bilhete adquirido. Acesse a seção Minhas Viagens, localize sua reserva e verifique as opções disponíveis. Alterações realizadas com mais de 48 horas de antecedência podem não gerar custos adicionais.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Quais formas de pagamento são aceitas?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Aceitamos cartão de crédito (Visa, Mastercard, American Express e Elo), PIX e boleto bancário. O parcelamento no cartão de crédito pode ser feito em até 12 vezes, sujeito a juros conforme a bandeira e número de parcelas escolhido.</p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-4">Bagagem</h2>

          <div className="space-y-6">
            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Qual é a franquia de bagagem?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">A franquia varia conforme a tarifa adquirida. Tarifas econômicas básicas geralmente incluem apenas bagagem de mão. Tarifas Plus e superiores incluem 1 volume despachado de até 23 kg. Para voos internacionais, verifique as regras específicas de cada companhia no momento da busca.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">O que fazer se minha bagagem for perdida?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Caso sua bagagem não chegue ao destino, dirija-se imediatamente ao balcão da companhia aérea no aeroporto e registre um RIB (Relatório de Irregularidade de Bagagem). Guarde o número do protocolo. A companhia tem até 7 dias para localizar bagagens extraviadas em voos domésticos e 21 dias em internacionais.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Posso levar bagagem de mão?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Sim. A bagagem de mão é permitida em todas as tarifas. O limite padrão é de 1 volume com até 10 kg e dimensões máximas de 55 x 35 x 25 cm. Itens de uso pessoal como bolsas pequenas e mochilas de notebook geralmente podem ser levados além da bagagem de mão, desde que caibam embaixo do assento.</p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-800 pb-10 mb-10">
          <h2 className="font-serif text-xl text-white mb-4">Check-in</h2>

          <div className="space-y-6">
            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Como fazer check-in online?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">O check-in online pode ser realizado pelo site ou aplicativo da companhia aérea responsável pelo voo. Acesse a área de check-in, informe o número do seu bilhete ou localizador e o CPF do passageiro principal. Escolha seus assentos e baixe ou envie o cartão de embarque para o seu e-mail.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Qual o prazo mínimo para check-in?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Para voos domésticos, recomenda-se chegar ao aeroporto com pelo menos 1h30 de antecedência. Para voos internacionais, o recomendado é de 3 horas. O check-in online pode ser feito entre 48 horas e 1 hora antes do voo. Os balcões de check-in nos aeroportos encerram com 45 minutos de antecedência.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Perdi meu voo, o que fazer?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Caso perca seu voo, dirija-se imediatamente ao balcão da companhia aérea no aeroporto. Dependendo do motivo e da tarifa adquirida, pode ser possível ser realocado em outro voo sem custo adicional ou mediante pagamento de diferença tarifária. Em caso de atraso causado pela própria companhia, você tem direito à realocação gratuita.</p>
            </div>
          </div>
        </div>

        <div className="pb-10">
          <h2 className="font-serif text-xl text-white mb-4">Conta</h2>

          <div className="space-y-6">
            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Como criar uma conta?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Para criar sua conta no maisumvoo, clique em Entrar no canto superior direito e selecione a opção Criar conta. Preencha seu nome completo, e-mail e senha. Após confirmar seu e-mail pelo link que enviaremos, sua conta estará ativa e pronta para uso.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Esqueci minha senha</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Clique em Entrar e em seguida em Esqueci minha senha. Informe o e-mail cadastrado e você receberá um link para redefinir sua senha em até 5 minutos. Verifique também a caixa de spam. O link de redefinição expira em 30 minutos por razões de segurança.</p>
            </div>

            <div>
              <p className="font-sans text-sm text-white font-medium mb-1">Como cancelar minha conta?</p>
              <p className="font-sans text-sm text-ink-400 leading-relaxed">Para solicitar o encerramento da sua conta, entre em contato com nosso suporte pelo e-mail suporte@maisumvoo.com.br informando o e-mail cadastrado e o motivo do cancelamento. O prazo para exclusão dos dados é de até 30 dias, conforme a Lei Geral de Proteção de Dados (LGPD). Reservas em aberto devem ser concluídas ou canceladas antes da solicitação.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-10 mt-10">
          <p className="font-sans text-sm text-ink-400 mb-4">Não encontrou o que procurava?</p>
          <Link
            href="/contato"
            className="font-sans text-sm border border-gold text-gold px-6 py-3 inline-block hover:bg-gold hover:text-ink-950 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            Fale com o suporte
          </Link>
        </div>
      </div>
    </div>
  );
}
