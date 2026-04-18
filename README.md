# LuxeFlow Commerce Studio

Premium full-stack foundation for a luxury jewelry e-commerce campaign platform.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- Recharts

## Quick Start

1. Install dependencies:
   - `npm install`
2. Set environment:
   - `cp .env.example .env`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run database migration:
   - `npm run prisma:migrate -- --name init_luxeflow_models`
5. Seed starter data:
   - `npm run prisma:seed`
6. Start dev server:
   - `npm run dev`

## Prisma Structure

- Schema: `prisma/schema.prisma`
- Seed script: `prisma/seed.mjs`

### Core entities

- `User`
- `ContentBlock`
- `Banner`
- `Collection`
- `Product`
- `Campaign`
- `CampaignAsset`
- `EmailTemplate`
- `EmailCampaign`
- `ABTest`
- `ABVariant`
- `AnalyticsEvent`
