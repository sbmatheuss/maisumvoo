# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Projeto

Site de compra de passagens aéreas estilo LATAM, chamado **maisumvoo**.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm run lint         # ESLint
npm run db:generate  # gera Prisma Client após alterar schema
npm run db:push      # aplica schema no banco (dev)
npm run db:studio    # GUI do Prisma para inspecionar dados
docker-compose up -d # sobe PostgreSQL e Redis localmente
```

## Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Estilização**: Tailwind CSS com design system customizado (`ink-*`, `gold`)
- **Estado**: Zustand (`src/store/useFlightStore.ts`)
- **Formulários**: React Hook Form + Zod
- **ORM**: Prisma + PostgreSQL
- **Cache**: ioredis (Redis)
- **Voos**: Amadeus SDK (sandbox)
- **Pagamentos**: Stripe
- **Agentes IA**: Anthropic SDK (`claude-sonnet-4-6`), 5 agentes implementados

## Arquitetura

```
src/
├── app/
│   ├── page.tsx                 # Homepage com hero + SearchForm
│   ├── voos/page.tsx            # Resultados (useSearchParams → Suspense)
│   ├── reserva/[id]/page.tsx    # Passageiros + resumo
│   ├── pagamento/page.tsx       # Stripe Elements
│   ├── minhas-viagens/page.tsx  # Histórico por email/CPF
│   └── api/
│       ├── flights/search/      # GET com cache Redis 300s
│       ├── flights/airports/    # GET autocomplete
│       ├── bookings/            # CRUD reservas
│       ├── payments/            # Stripe create-intent + webhook
│       └── agents/              # 5 rotas de agentes IA
├── components/
│   ├── ui/          # Button, Input, Header, Footer, Spinner, Modal
│   ├── search/      # SearchForm, AirportInput, DatePicker, PassengerSelector
│   ├── flights/     # FlightCard, FlightFilters, FlightList
│   ├── booking/     # PassengerForm, Summary
│   └── agents/      # ChatWidget, PriceAlertForm
├── lib/
│   ├── db.ts        # Prisma singleton (globalThis)
│   ├── redis.ts     # ioredis singleton + helpers getCache/setCache/delCache
│   ├── amadeus.ts   # Lazy init, mapeia resposta raw → FlightOffer[]
│   ├── stripe.ts    # Lazy init via getStripe()
│   └── agents/      # search, chat, recommendation, price-monitor, fraud-detection
├── store/
│   └── useFlightStore.ts  # searchParams, flights, selectedFlight, filters
└── types/
    ├── index.ts     # Todos os tipos compartilhados
    └── amadeus.d.ts # Declaração de módulo para o SDK Amadeus
```

## Design System

- **Paleta**: quase monocromática — `ink-950` (#080808) a `ink-50` (#F5F5F5)
- **Acento**: `gold` (#C8A96E) — usar somente em CTAs, preços e hover de links ativos
- **Tipografia**: `font-serif` (Playfair Display) em títulos; `font-sans` (Inter) no resto
- **Border-radius**: máximo 2px — nunca usar classes `rounded-lg/xl/full`
- **Sem**: gradientes coloridos, ícones decorativos no header, cores vibrantes, "pílulas"

## Convenções

- Todas as API routes têm `export const dynamic = 'force-dynamic'` (evita pre-render)
- `ApiResponse<T>` é o envelope padrão: `{ data: T | null, error: string | null }`
- Inicialização lazy para clientes externos: `getAmadeus()`, `getStripe()` (não inicializar no nível de módulo)
- `src/lib/agents/*.ts` implementam prompt caching (`cache_control: { type: "ephemeral" }`)
- Componentes que usam `useSearchParams()` devem estar dentro de `<Suspense>`

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:
- `DATABASE_URL`, `REDIS_URL`
- `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET` (sandbox: developers.amadeus.com)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `ANTHROPIC_API_KEY`
