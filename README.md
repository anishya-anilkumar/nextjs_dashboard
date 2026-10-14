# Acme Financial Dashboard

A database-backed invoice dashboard inspired by the official Next.js Learn dashboard tutorial.
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · PostgreSQL (`postgres`) · Auth.js · Zod.

## Features
- Public landing page and login (real credentials auth, bcrypt hashes, HttpOnly session cookie, 8h sessions)
- Dashboard: collected / pending revenue, invoice and customer counts, 12-month revenue chart, recent invoices — all computed from the database, with skeletons, empty and error states
- Invoices: list, search (URL params), status filter, pagination, create, edit, delete with confirmation dialog; server-side Zod validation with inline errors that preserve your input
- Customers: invoice count, total invoiced and outstanding balance per customer, with search
- Money stored as integer cents; all SQL parameterized; LIKE wildcards in search are escaped
- Route protection in `proxy.ts` **and** a server-side `requireUser()` check in every query and action
- Responsive layout: sidebar on desktop, collapsible menu on mobile

## Prerequisites
Node.js 20.9+ (22 recommended) and a PostgreSQL database (local, Vercel Postgres/Neon, Supabase…).

## Setup
```bash
npm install
cp .env.example .env        # then edit .env
```
Fill in `.env`:
- `POSTGRES_URL` – connection string (hosted providers usually need `?sslmode=require`)
- `AUTH_SECRET` – `openssl rand -base64 32`
- `SEED_DEMO_PASSWORD` – password for the demo user (min 8 chars)

Create a local database if needed: `createdb dashboard` (and use e.g. `postgres://user:pass@localhost:5432/dashboard`).

```bash
npm run db:migrate    # apply db/schema.sql (idempotent)
npm run db:seed       # demo data: 10 customers, 36 invoices, user demo@example.com
npm run dev           # http://localhost:3000
```
Log in with `demo@example.com` and the `SEED_DEMO_PASSWORD` you chose. Demo rows have `is_demo = TRUE`;
re-running the seed replaces only demo rows. To remove them: `DELETE FROM customers WHERE is_demo; DELETE FROM users WHERE is_demo;`.

**Real users:** insert a user with a bcrypt hash, e.g.
`node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD',12))"` then
`INSERT INTO users(name,email,password_hash) VALUES ('Name','you@example.com','<hash>');`

## Scripts
| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | develop / production build / serve build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | unit tests (money, pagination, validation) |
| `npm run db:migrate` / `db:seed` / `db:setup` | schema / demo data / both |

## Deploy to Vercel
1. Push the repo to GitHub and import it in Vercel.
2. Add a Postgres database (Vercel Marketplace → Neon, or any provider) and set env vars in the project:
   `POSTGRES_URL`, `AUTH_SECRET` (and `SEED_DEMO_PASSWORD` only if you will seed from your machine).
3. Run `npm run db:migrate` (and optionally `db:seed`) locally with `POSTGRES_URL` pointing at the hosted database.
4. Deploy. Do not set `AUTH_TRUST_HOST` on Vercel.

Self-hosting (`next start`, Docker): set `AUTH_TRUST_HOST=true` only behind a proxy that validates the Host header.

## Security notes and limits
- All authenticated users share one workspace (as in the tutorial); there are no per-user roles.
- No login rate limiting — add one (e.g. at your proxy/CDN) before exposing publicly.
- Never commit `.env`; only `.env.example` is tracked.

## Structure
```
app/            routes, layouts (landing, login, dashboard/*)
app/ui/         reusable components (nav, cards, chart, tables, forms, skeletons)
app/lib/        db, data queries, server actions, validation, utils, session guard
auth.ts, auth.config.ts, proxy.ts   authentication + route protection (Next 16 "proxy")
db/schema.sql, scripts/             schema, migrate and seed
tests/          unit tests
```
