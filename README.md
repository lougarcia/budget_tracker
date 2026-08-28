# Budget Tracker

A production-oriented personal and collaborative budgeting web application built with Astro, TypeScript, and Cloudflare.

## Features

### Core

- **Trackers** — Create multiple independent financial workspaces, each with its own currency, categories, budgets, and transactions
- **Transactions** — Record income and expenses with merchant, category, date, payment method, and notes
- **Categories** — Organize transactions into income and expense categories with custom colors and icons
- **Budgets** — Set monthly budgets per category and track actual vs. planned spending with progress bars
- **Recurring Transactions** — Define repeating income/expenses (weekly, biweekly, monthly, quarterly, yearly) with automatic next-occurrence tracking
- **Reports** — Monthly, quarterly, and yearly reports with category breakdowns, largest purchases, and spending trends
- **Collaboration** — Invite other users to collaborate on a Tracker with owner/member roles

### UX

- Animated dashboard with GSAP entrance animations
- View Transitions for fast, SPA-like navigation
- Responsive design (mobile, tablet, desktop)
- Accessible (skip links, ARIA labels, keyboard navigation, semantic HTML, `aria-live` regions)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (SSR) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| ORM | Drizzle ORM |
| Database | SQLite (local) / Turso libSQL (production) |
| Auth | Better Auth (email + password) |
| Validation | Zod |
| Animation | GSAP |
| Deployment | Cloudflare Workers |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install

```sh
pnpm install
```

### Environment Variables

Create a `.env` file (**optional for local dev** — defaults are provided):

```sh
DATABASE_URL="file:local.db"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:4321"
```

### Development

```sh
pnpm dev
```

The app runs at `http://localhost:4321`.

### Seed Data

```sh
pnpm seed
```

Creates a test user (`test@example.com` / `password123`) with a tracker, categories, transactions, and recurring transactions.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm typecheck` | Run Astro type checking |
| `pnpm test` | Run tests (vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm seed` | Seed database with test data |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
  db/
    schema.ts          # Database schema (Better Auth + app tables)
    index.ts           # Database connection helper
  lib/
    money.ts           # Currency formatting (integer minor units)
    validators.ts      # Zod validation schemas
    auth-guards.ts     # Authorization helpers
  layouts/
    Layout.astro       # Main layout with nav, footer, View Transitions
  pages/
    index.astro        # Landing page
    login.astro        # Login
    register.astro     # Registration
    app/
      trackers/
        index.astro           # Tracker list / create tracker
        [trackerId]/
          index.astro         # Dashboard (summary, transactions, period selector)
          transactions.astro  # Transaction list with search/filter/sort
          budget.astro        # Monthly budget vs. actual
          categories.astro    # Category management
          recurring.astro     # Recurring transactions
          collaborate.astro   # Members & invitations
          reports/
            monthly.astro     # Monthly report
            quarterly.astro   # Quarterly report
            yearly.astro      # Yearly report
      settings/
        index.astro           # Profile, password, currency preferences
  styles/
    global.css         # Global Tailwind styles
  auth.ts              # Better Auth configuration
  middleware.ts        # Session handling, route protection, auto-tracker creation
scripts/
  seed.ts              # Database seed script
  fix-account.ts       # Diagnostic script for orphaned users
tests/
  validators.test.ts   # Validator tests
  money.test.ts        # Money utility tests
  auth-guards.test.ts  # Auth guard tests
```

## Architecture

```
UI (Astro components)
  ↓
RPC endpoint (/api/rpc)
  ↓
Authentication (Better Auth session)
  ↓
Authorization (tracker membership check)
  ↓
Zod validation
  ↓
Business logic
  ↓
Drizzle ORM
  ↓
SQLite / Turso libSQL
```

All database mutations go through the RPC handler. No client-side code directly mutates the database.

## Database Schema

Key tables:

- **user** — Better Auth user records
- **account** — Better Auth account/password records
- **session** — Better Auth sessions
- **trackers** — Financial workspaces (name, currency, owner)
- **tracker_members** — User-trackership roles (owner/member)
- **tracker_invitations** — Pending collaboration invitations
- **categories** — Income/expense categories per tracker
- **transactions** — Individual income/expense records
- **budgets** — Monthly budget amounts per category
- **recurring_transactions** — repeating transactions with frequency
- **user_preferences** — User settings (default currency)

## Financial Data

All monetary values are stored as **integer minor units** (cents):

- `$10.99` → `1099`
- `$100.00` → `10000`

Never use floating-point for money. The `formatMoney()` utility in `src/lib/money.ts` handles display formatting.

## Testing

Tests cover:

- **Validators** — Zod schema validation for all inputs
- **Money utilities** — Formatting, parsing, summary calculations
- **Auth guards** — Authorization checks for tracker access

```sh
pnpm test        # Single run
pnpm test:watch  # Watch mode
```

## Deployment

### Cloudflare Workers

1. Configure `wrangler.jsonc` with your Cloudflare account
2. Set environment variables in the Cloudflare dashboard or `wrangler secret put`
3. For production, use Turso/libSQL instead of local SQLite:

```sh
DATABASE_URL="libsql://your-db.turso.io"
DATABASE_AUTH_TOKEN="your-turso-auth-token"
```

4. Deploy:

```sh
pnpm build
wrangler deploy
```

## License

MIT
