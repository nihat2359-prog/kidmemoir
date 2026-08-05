# KidMemoir

KidMemoir is a privacy-first digital memory platform for parents to preserve and understand their children's life journeys. This repository currently contains the production-ready project foundation only; application screens and domain logic are intentionally out of scope.

## Technology stack

- Next.js 16 with the App Router and React Server Components
- React 19 and strict TypeScript
- Tailwind CSS v4 and shadcn/ui foundations
- Supabase (PostgreSQL, Auth, Storage, and RLS-ready clients)
- React Hook Form and Zod
- Framer Motion and Lucide React
- ESLint, Prettier, Husky, and lint-staged

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- A Supabase project for environment-specific development

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Add the Supabase project values to `.env.local`.

4. Start the development server:

   ```bash
   npm run dev
   ```

No application page is included in the foundation phase. Routes are added only as their documented product tasks begin.

## Available commands

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Turbopack development server   |
| `npm run build`        | Create a production build                |
| `npm run start`        | Serve the production build               |
| `npm run lint`         | Run ESLint with zero warnings allowed    |
| `npm run type-check`   | Run strict TypeScript checks             |
| `npm run format`       | Format supported files                   |
| `npm run format:check` | Verify formatting without changing files |

## Project structure

```text
src/
├── app/                 # App Router layouts, routes, and route boundaries
├── actions/             # Cross-feature server actions
├── components/
│   ├── providers/       # Application-level React providers
│   └── ui/              # shadcn/ui primitives
├── features/            # Independent domain feature modules
├── hooks/               # Cross-feature React hooks
├── lib/                 # Framework and third-party integrations
│   └── supabase/        # Browser/server Supabase client factories
├── services/            # External service adapters
├── styles/              # Global styles and design tokens
├── types/               # Shared TypeScript types
└── utils/               # Framework-independent utilities
```

Each feature owns its components, actions, hooks, schemas, services, types, and utilities when they are introduced. Features must not depend directly on one another.

## Architecture principles

- Server Components are the default; Client Components are introduced only for interaction.
- Data mutations use validated Server Actions.
- Authorization is enforced with Supabase Auth, JWT validation, and Row Level Security.
- UI code and business logic remain separate.
- Styling uses Tailwind utilities and semantic CSS variables; hard-coded product colors are avoided.
- Light and dark themes are available at the infrastructure level through `next-themes`.
- The `@/` alias resolves to `src/`.

## Environment variables

| Variable                        | Scope              | Description                                         |
| ------------------------------- | ------------------ | --------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Browser and server | Supabase project URL                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server | Supabase anonymous key, protected by RLS            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only        | Privileged key for future trusted server operations |

Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code or commit local environment files.

## Development workflow

Before opening a change, read the relevant documentation in `docs/`. The governing references are `01_Product_Rules.md`, the relevant screen PRD, `31_Architecture.md`, `32_Development_Guide.md`, and `34_Codex_Workflow.md`, in that order where applicable.

Commits are protected by Husky and lint-staged. Staged source files are linted and formatted before a commit is created.
