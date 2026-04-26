# LuxeFlow Commerce Studio

A Next.js app for a luxury jewelry e-commerce and campaign experience: a **public storefront**, **campaign landings**, a **LuxeFlow Studio** area for marketing and content tools, and a **Jewelry Admin** for inventory and B2B operations (all backed by PostgreSQL via Prisma).

## What’s in the repo

| Area | Route(s) | Purpose |
|------|----------|---------|
| **Storefront** | `/`, `/products`, `/collections`, `/product/[slug]` | Public shopping and discovery UI. |
| **Campaigns** | `/c/[campaignSlug]` | Per-campaign landing pages. |
| **LuxeFlow Studio** | `/studio`, `/studio/*` | Internal-style tools: dashboard, content, campaigns, email templates, AI copy, experiments, analytics, settings, and a design system page. Not gated by the same middleware as admin (see [Authentication](#authentication)). |
| **Jewelry Admin** | `/admin`, `/admin/*` | Operations: overview, inventory, suppliers, B2B customers, quotes, orders. **Requires login.** |

Search and admin chrome include UX details such as a global search palette (⌘K) and a demo-only “private atelier” affordance; behavior is implemented in the layout and `GlobalSearchPalette` component.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | React 19, TypeScript, [Tailwind CSS](https://tailwindcss.com/) 3 |
| Data | [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/) 6 |
| Auth (admin) | [jose](https://github.com/panva/jose) JWT verification, HTTP-only cookie `admin_session` |
| Validation | [Zod](https://zod.dev/) |
| Charts | [Recharts](https://recharts.org/) (where analytics dashboards use charts) |

## Prerequisites

- **Node.js** (LTS recommended; the repo uses modern Next/React)
- **PostgreSQL** running locally (or a remote URL in `DATABASE_URL`)

## Environment variables

Copy the example file and adjust values:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma. |
| `ADMIN_JWT_SECRET` | Secret for signing the admin session JWT (**minimum 16 characters** in production). |
| `ADMIN_PASSWORD` | Development password used by the admin login flow (set a strong value in production and align with your deploy secrets). |

**Production:** use a long random `ADMIN_JWT_SECRET`, HTTPS, and secure cookie settings as appropriate for your host.

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment** (see above).

3. **Prisma client**

   ```bash
   npm run prisma:generate
   ```

4. **Run migrations** (creates/updates tables from `prisma/schema.prisma`)

   ```bash
   npm run prisma:migrate -- --name init
   ```

5. **Seed sample data** (optional but useful for a populated UI)

   ```bash
   npm run prisma:seed
   ```

6. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Admin UI: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (then `/admin` after sign-in).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js development server. |
| `npm run build` | Production build. |
| `npm run start` | Run production server (after `build`). |
| `npm run lint` | ESLint across the project. |
| `npm run prisma:generate` | Generate Prisma Client. |
| `npm run prisma:migrate` | Create/apply dev migrations (`prisma migrate dev`). |
| `npm run prisma:seed` | Run `prisma/seed.mjs` seed data. |

## Authentication

- **`src/middleware.ts`** protects routes under `/admin` (except `/admin/login` when not already logged in).
- Valid `ADMIN_JWT_SECRET` is required; otherwise users are redirected to login with a config error.
- Admin session is stored in the `admin_session` cookie; API routes under `src/app/api/auth/admin/` and `src/app/api/admin/**` back the app’s admin and jewelry operations.

Studio routes (`/studio`) are **not** covered by the admin middleware; treat them as a separate, presentation-first surface unless you add your own auth.

## Database (Prisma)

- **Schema:** `prisma/schema.prisma`
- **Seed:** `prisma/seed.mjs` (referenced from `package.json` `prisma.seed`)

Core models include (among others) `User`, `ContentBlock`, `Banner`, `Collection`, `Product`, `Campaign`, `CampaignAsset`, `EmailTemplate`, `EmailCampaign`, `ABTest`, `ABVariant`, and `AnalyticsEvent`, plus relations suited to campaign and catalog workflows.

## Project layout (high level)

```
src/
  app/                 # App Router: storefront, studio, admin, campaign pages, API routes
  components/         # UI, layouts (e.g. studio shell, inventory admin), storefront, search palette
  lib/                # Utilities, search, inventory admin helpers, Prisma access patterns
  middleware.ts        # Admin route protection
prisma/
  schema.prisma
  seed.mjs
```

API routes live under `src/app/api/` (e.g. `api/admin/*` for CRUD, `api/auth/admin/*` for session).

## Quality checks

Before pushing or opening a PR:

```bash
npm run lint
npm run build
```

---

**LuxeFlow Commerce Studio** is a foundation for premium commerce and campaign work: extend Studio for marketing flows, wire admin APIs to your operational data, and keep secrets out of version control (use `.env` locally, never commit real production credentials).
