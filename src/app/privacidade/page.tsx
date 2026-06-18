import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="border-b border-ink-800 bg-ink-900">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-2">Legal</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Política de Privacidade</h1>
          <p className="font-sans text-ink-500 text-xs mt-3">Última atualização: 1 de janeiro de 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        <section className="border-b border-ink-800 pb-8">
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Esta Política de Privacidade descreve como o maisumvoo coleta, utiliza e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais — <span className="text-white">LGPD (Lei n.º 13.709/2018)</span>. Ao utilizar nossa plataforma, você consente com as práticas descritas neste documento.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">1. Dados Coletados</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Coletamos os dados necessários para viabilizar a prestação dos nossos serviços, incluindo: nome completo, endereço de e-mail, CPF, data de nascimento, número de telefone e dados do documento de viagem (passaporte ou RG) dos passageiros. Para o processamento de pagamentos, coletamos os dados do cartão de crédito ou débito, que são tratados diretamente pela Stripe, nosso processador de pagamentos certificado PCI-DSS.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Também coletamos automaticamente dados de navegação, como endereço IP, tipo de dispositivo, sistema operacional, navegador utilizado, páginas visitadas e tempo de sessão. Essas informações nos ajudam a melhorar a performance e a experiência do usuário na plataforma.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">2. Como Usamos seus Dados</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Seus dados pessoais são utilizados para processar e confirmar reservas de passagens aéreas, emitir bilhetes, enviar comprovantes e comunicações transacionais relacionadas à sua viagem. Também utilizamos seus dados para personalizar a sua experiência na plataforma, exibindo ofertas e destinos relevantes com base no seu histórico de buscas.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Com o seu consentimento, utilizamos seu e-mail para enviar alertas de variação de preço em rotas de seu interesse e comunicações de marketing sobre promoções e destinos. Você pode cancelar o recebimento dessas comunicações a qualquer momento através das configurações da sua conta ou pelo link de descadastro presente nos e-mails.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">3. Compartilhamento de Dados</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Compartilhamos seus dados pessoais somente com as companhias aéreas parceiras envolvidas na sua reserva — o que é estritamente necessário para a emissão do bilhete e a prestação do serviço de transporte — e com nossos processadores de pagamento, que atuam como operadores sob nossas instruções e possuem obrigações contratuais de proteção de dados equivalentes às nossas.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            O maisumvoo nunca vende, aluga ou comercializa seus dados pessoais com terceiros para fins de marketing. Compartilhamentos adicionais somente ocorrerão mediante determinação legal, judicial ou regulatória, sempre nos limites do estritamente necessário.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">4. Cookies e Rastreamento</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Utilizamos cookies e tecnologias similares para garantir o funcionamento da plataforma, lembrar suas preferências e analisar o comportamento de navegação. Você pode gerenciar suas preferências de cookies a qualquer momento.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Para informações detalhadas sobre os tipos de cookies que utilizamos, suas finalidades e como gerenciá-los, consulte nossa <Link href="/cookies" className="text-gold underline underline-offset-2">Política de Cookies</Link>.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">5. Segurança dos Dados</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, perda, alteração ou divulgação indevida. Toda a comunicação entre seu navegador e nossos servidores é protegida por criptografia SSL/TLS, e os dados sensíveis são armazenados de forma criptografada em infraestrutura segura.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Realizamos revisões periódicas de segurança e adotamos práticas de desenvolvimento seguro. Em caso de incidente de segurança que possa afetar seus dados, notificaremos a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados nos prazos previstos pela LGPD.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            A LGPD garante a você os seguintes direitos em relação aos seus dados pessoais: confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou incorretos, anonimização ou exclusão de dados desnecessários, portabilidade dos dados a outro fornecedor de serviço, revogação do consentimento e oposição ao tratamento.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail <span className="text-gold">privacidade@maisumvoo.com.br</span>. Atenderemos a sua solicitação dentro do prazo legal de até 15 dias, podendo solicitar a confirmação de identidade para garantir a segurança do processo.
          </p>
        </section>

        <section className="border-b border-ink-800 pb-8">
          <h2 className="font-serif text-xl text-white mb-4">7. Retenção de Dados</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Os dados pessoais vinculados a reservas e transações são mantidos por um período mínimo de 5 anos, conforme determinado pela legislação tributária e de defesa do consumidor aplicável no Brasil. Dados de navegação e preferências de conta são mantidos pelo período em que a conta permanecer ativa.
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Após o encerramento da conta ou o decurso dos prazos legais de retenção, os dados serão eliminados de forma segura ou anonimizados, de modo que não seja mais possível identificar o titular. Dados objeto de investigação judicial ou administrativa serão retidos pelo tempo necessário para a conclusão do processo.
          </p>
        </section>

        <section className="pb-8">
          <h2 className="font-serif text-xl text-white mb-4">8. Contato do Encarregado (DPO)</h2>
          <p className="font-sans text-sm text-ink-400 leading-relaxed">
            Em conformidade com o artigo 41 da LGPD, o maisumvoo designou um Encarregado pelo Tratamento de Dados Pessoais (Data Protection Officer — DPO), responsável por atuar como canal de comunicação entre a empresa, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
          <p className="font-sans text-sm text-ink-400 leading-relaxed mt-3">
            Você pode entrar em contato com nosso DPO pelo e-mail <span className="text-gold">dpo@maisumvoo.com.br</span> para quaisquer questões relacionadas ao tratamento de dados pessoais, ao exercício de direitos previstos na LGPD ou para apresentar reclamações sobre nossas práticas de privacidade.
          </p>
        </section>

      </div>
    </div>
  );
}
