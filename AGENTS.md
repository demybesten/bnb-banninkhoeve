# Repository Guidelines

**Language:** Always respond in English. Never use Chinese (or any language other than English) in replies, code comments, commit messages, or documentation.

## Project Structure & Module Organization

```
app/                   # Next.js App Router pages and API routes
  page.tsx             # Homepage
  about/page.tsx       # About page
  contact/page.tsx     # Contact form page
  rooms/               # Room listing, detail, loading/error states
  admin/               # Admin panel (login, dashboard, rooms CRUD, availability, iCal sources)
  api/                 # REST API routes (auth, rooms, bookings, contact, upload, reviews, calendar)
components/            # Shared React components (Navigation, Footer, BookingWidget, AvailabilityCalendar, etc.)
lib/                   # Server/client utilities (prisma, auth, i18n, ical, emailjs)
prisma/                # Prisma schema (SQLite) and migrations
dictionaries/          # i18n translation files (en.json, nl.json)
scripts/seed.ts        # Database seed script
proxy.ts               # Middleware: JWT auth guard for /admin routes (Next.js 16 proxy convention)
```

Path alias: `@/*` maps to the repository root (configured in `tsconfig.json`).

## Build, Test & Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js dev server on [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint (Next.js flat config + TypeScript presets) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:push` | Push Prisma schema to SQLite (`dev.db`) |
| `npm run db:seed` | Seed the database with sample data |
| `npm run setup` | `db:generate && db:push && db:seed` (full first-time setup) |

Copy `.env.example` to `.env.local` and fill in required values before running.

## Coding Style & Naming Conventions

- **Language:** TypeScript with `strict: true`
- **Formatting:** 2-space indentation. ESLint via `eslint-config-next` (core-web-vitals + typescript presets). Run `npm run lint` before committing.
- **File naming:** `kebab-case` for directories, `PascalCase` for components (`RoomGallery.tsx`), `camelCase` for utilities (`lib/prisma.ts`).
- **Imports:** Use `@/` path alias for internal imports (e.g., `import { prisma } from '@/lib/prisma'`). Do not use relative paths above `../`.
- **Components:** Server Components by default. Add `"use client"` only when using hooks or browser APIs.
- **API routes:** Route handlers live in `app/api/.../route.ts`. Use standard HTTP method exports (`GET`, `POST`, `PUT`, `DELETE`).

## Internationalization

The site supports English (`en`) and Dutch (`nl`). Key rules:

- Translation keys are defined as typed JSON in `dictionaries/{locale}.json`.
- Use `lib/i18n.ts` for server-side dictionary loading and `lib/i18n-client.tsx` for the client-side React context.
- Add new keys to **both** `en.json` and `nl.json`. The `Dictionary` type is derived from `en.json` — missing keys in `nl.json` will cause type errors.
- The `LanguageSwitcher` component reads/writes locale via URL path or cookie.

## Database

- **SQLite** via Prisma ORM. Schema at `prisma/schema.prisma`.
- Models: `Room`, `Admin`, `Booking`, `IcalSource`.
- After schema changes, run `npm run db:generate` to update the Prisma client.
- Seed data via `scripts/seed.ts` — update it when adding required defaults.

## Testing Guidelines

No test framework is currently configured. When writing manual validation:
- Start the dev server and verify page renders, form submissions, and API responses.
- Test i18n by switching languages and confirming all keys resolve.
- Test admin auth by accessing `/admin/dashboard` unauthenticated (should redirect to `/admin/login`).

## Commit & Pull Request Guidelines

- **Commit style:** short, imperative summaries (e.g., "translations admin", "gallery fix", "i cal sync, admin header").
- Group related changes (a commit should touch files for one logical change).
- Link PRs to the issue or feature they address. Include a brief description of what changed and why.
- For UI changes, include before/after screenshots or testing notes.

## Architecture Notes

- **Auth:** JWT-based session cookies using the `jose` library. Auth logic in `lib/auth.ts`. Admin route protection via `proxy.ts` middleware (Next.js 16 convention; not `middleware.ts`).
- **iCal sync:** `lib/ical.ts` handles parsing external `.ics` feeds from Airbnb/Bedandbreakfast.eu. Sync is triggered via the admin UI or API at `/api/admin/ical-sync`.
- **File uploads:** Handled via `app/api/upload/route.ts` using the `formidable` library.
- **Email:** Contact and booking forms use `@emailjs/browser` on the client side. Configure keys in `.env.local`.
- **Maps:** Google Maps and Places API via `@react-google-maps/api`. Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `GOOGLE_PLACES_API_KEY`.

## Next.js 16 Caveats

This project runs Next.js 16.2.6, which has breaking changes from earlier versions. Before writing code, consult the built-in docs at `node_modules/next/dist/docs/` for current API conventions.
