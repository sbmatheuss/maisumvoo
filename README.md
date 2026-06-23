# maisumvoo

Site de compra de passagens aéreas com design premium, agentes de IA e fluxo completo de reserva e pagamento.

---

## Funcionalidades

- **Busca de voos** com filtros por preço, companhia, paradas e horário
- **Autocomplete de aeroportos** com 30 destinos nacionais e internacionais
- **Reserva completa** com formulário de passageiros e resumo do voo
- **Pagamento simulado** + suporte a Pix e Boleto via Stripe
- **Histórico de viagens** por e-mail ou CPF
- **Autenticação** com login e cadastro
- **5 Agentes de IA** (Anthropic Claude):
  - Assistente de atendimento (chat 24h)
  - Busca inteligente de voos
  - Recomendações personalizadas
  - Monitor de preços com alertas
  - Detecção de fraude em tempo real
- **Sistema de milhas** com estimativa de resgate
- **Formulário de contato** com persistência no banco
- **Páginas institucionais**: Sobre, Ajuda, Carreiras, Destinos, Políticas

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Estilização | Tailwind CSS com design system customizado |
| Estado global | Zustand |
| Formulários | React Hook Form + Zod |
| ORM | Prisma + PostgreSQL (Neon) |
| Cache | ioredis (Upstash) |
| Pagamentos | Stripe (Cartão, Pix, Boleto) |
| Agentes IA | Anthropic SDK (claude-sonnet-4-6) |

---

## Design System

- **Paleta**: monocromática `ink-950` → `ink-50` com acento `gold` (#C8A96E)
- **Tipografia**: Playfair Display (títulos) + Inter (corpo)
- **Border-radius**: máximo 2px — sem bordas arredondadas
- **Sem**: gradientes coloridos, ícones decorativos, cores vibrantes

---

## Estrutura

```
src/
├── app/
│   ├── page.tsx                  # Homepage com hero e busca
│   ├── voos/                     # Resultados com filtros
│   ├── reserva/[id]/             # Formulário de passageiros
│   ├── pagamento/                # Checkout (Stripe + simulação)
│   ├── minhas-viagens/           # Histórico de reservas
│   ├── auth/                     # Login e cadastro
│   └── api/                      # 20+ API routes
├── components/
│   ├── ui/                       # Button, Input, Header, Footer, Modal
│   ├── search/                   # SearchForm, AirportInput, DatePicker
│   ├── flights/                  # FlightCard, FlightList, FlightFilters
│   ├── booking/                  # PassengerForm, Summary
│   └── agents/                   # ChatWidget, PriceAlertForm, MilesWidget
├── lib/
│   ├── amadeus.ts                # Aeroportos estáticos + voos mock
│   ├── db.ts                     # Prisma singleton
│   ├── redis.ts                  # ioredis singleton + helpers
│   ├── stripe.ts                 # Stripe lazy init
│   └── agents/                   # 6 agentes IA com prompt caching
├── store/
│   └── useFlightStore.ts         # Estado global de voos e busca
└── types/
    └── index.ts                  # Tipos compartilhados
```

---

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/sbmatheuss/maisumvoo.git
cd maisumvoo

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Aplicar schema no banco
npm run db:push

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Variáveis de ambiente

```env
# Banco de dados (Neon recomendado)
DATABASE_URL="postgresql://..."

# Cache (Upstash recomendado)
REDIS_URL="rediss://..."

# IA
ANTHROPIC_API_KEY="sk-ant-..."

# Pagamentos (opcional — simulação disponível sem Stripe)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> Sem Stripe configurado, a página de pagamento exibe o botão **"Simular pagamento aprovado"** para fins de demonstração.

---

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # ESLint
npm run db:generate  # Gera Prisma Client
npm run db:push      # Aplica schema no banco
npm run db:studio    # GUI do Prisma
```

---

## Deploy

O projeto está configurado para deploy na [Vercel](https://vercel.com). Configure as variáveis de ambiente no painel da Vercel antes de fazer o deploy.

---

Desenvolvido como projeto de estudo de arquitetura full-stack com Next.js 14 e IA.
