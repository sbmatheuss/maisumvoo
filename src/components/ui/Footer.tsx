import Link from "next/link";

const footerLinks = {
  Empresa: [
    { label: "Sobre nós", href: "/sobre" },
    { label: "Carreiras", href: "/carreiras" },
    { label: "Imprensa", href: "/imprensa" },
    { label: "Parceiros", href: "/parceiros" },
  ],
  Suporte: [
    { label: "Central de Ajuda", href: "/ajuda" },
    { label: "Fale Conosco", href: "/contato" },
    { label: "Cancelamentos", href: "/cancelamentos" },
    { label: "Reembolsos", href: "/reembolsos" },
  ],
  Destinos: [
    { label: "São Paulo", href: "/destinos/sao-paulo" },
    { label: "Rio de Janeiro", href: "/destinos/rio-de-janeiro" },
    { label: "Fortaleza", href: "/destinos/fortaleza" },
    { label: "Salvador", href: "/destinos/salvador" },
  ],
  Legal: [
    { label: "Termos de Uso", href: "/termos" },
    { label: "Privacidade", href: "/privacidade" },
    { label: "Cookies", href: "/cookies" },
    { label: "Acessibilidade", href: "/acessibilidade" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-ink-800">
      <div className="container py-12">
        <div className="mb-10">
          <span className="font-serif font-bold text-lg text-ink-300">
            maisumvoo
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-ink-400 hover:text-ink-200 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ink-800 pt-6">
          <p className="font-sans text-xs text-ink-600">
            © {new Date().getFullYear()} maisumvoo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
