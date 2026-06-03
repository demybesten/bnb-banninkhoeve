# Pre-launch Checklist

Everything that must be done before going live. Check off items as completed.

---

## Critical: Database

- [ ] **Switch from SQLite to a production database.** SQLite (`dev.db`) won't work on Vercel — the filesystem is ephemeral, so data disappears between deploys and can't be shared across serverless instances. Options:
  - **[Turso](https://turso.tech)** — SQLite-compatible, minimal code changes (swap Prisma provider to `libsql`), generous free tier
  - **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** — managed PostgreSQL, tight Vercel integration
  - **[Neon](https://neon.tech)** — serverless PostgreSQL, free tier available
- [ ] Update `prisma/schema.prisma` with the new `datasource` provider and connection URL
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Run `npx prisma db push` against the production database
- [ ] Re-seed the production database with real data (see Seed Data section below)

---

## Environment Variables (Vercel Dashboard)

Copy these from `.env.local` into **Vercel → Settings → Environment Variables**, replacing placeholders with real values:

- [ ] `DATABASE_URL` — your production database connection string
- [ ] `JWT_SECRET` — a long, random string (keep the existing one or generate new: `openssl rand -hex 32`)
- [ ] `CRON_SECRET` — the value from `.env.local` (used by the scheduled iCal sync)
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Google Maps JavaScript API key with Maps + Places APIs enabled
- [ ] `GOOGLE_PLACES_API_KEY` — same or separate Google Places API key
- [ ] `NEXT_PUBLIC_GOOGLE_PLACE_ID` — your property's Google Place ID (from the Google Places API)
- [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID` — EmailJS service ID
- [ ] `NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID` — EmailJS template ID for contact form
- [ ] `NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID` — EmailJS template ID for booking form
- [ ] `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — EmailJS public key
- [ ] `ADMIN_EMAIL` — your real email address (for notifications/replies)

---

## Seed Data / Real Content

The seed script (`scripts/seed.ts`) creates sample data. Before going live:

- [ ] **Replace sample rooms** with your actual rooms — real names, descriptions, prices, capacities, and amenities
- [ ] **Replace Unsplash image URLs** with your own photos (upload via the admin panel or use a CDN)
- [ ] **Change the admin password** — the seed creates `admin` / `admin123`. After the first deploy, log in and change it, or update `scripts/seed.ts` before seeding the production DB
- [ ] Update the admin username if desired

---

## iCal Sync

- [ ] **Add real iCal feed URLs** — go to `/admin/availability` → "iCal Sync" tab and add your Airbnb and Bedandbreakfast `.ics` calendar URLs
- [ ] Verify sync works: click "Sync All" and check that bookings appear in the calendar
- [ ] Confirm the **export URL** (shown at the bottom of the iCal Sync tab) works. Give this URL to Airbnb and Bedandbreakfast so they can see your bookings
- [ ] Set `CRON_SECRET` in Vercel env vars so the daily cron sync works

---

## Contact / Phone / Email

These placeholder strings appear throughout the site:

- [ ] Replace `[PHONE]` — edit both `dictionaries/en.json` and `dictionaries/nl.json`, search for `[PHONE]` (6 occurrences total: footer phone, contact phone, booking call-us)
- [ ] Replace `[EMAIL]` — same files, search for `[EMAIL]` (6 occurrences total: footer email, contact email, booking email-us)

---

## EmailJS Templates

- [ ] Create the **contact form template** in EmailJS with these variables: `from_name`, `reply_to`, `phone`, `message`
- [ ] Create the **booking form template** in EmailJS with these variables: `from_name`, `reply_to`, `phone`, `message`, `check_in`, `check_out`, `guests`, `room_name`, `nights`, `total_price`
- [ ] Test both forms — submit the contact form at `/contact` and a booking request from a room detail page

---

## Google Maps

- [ ] Ensure the Google Cloud project has these APIs enabled: **Maps JavaScript API**, **Places API**, **Geocoding API**
- [ ] Restrict the API key to your production domain (Google Cloud Console → API Keys → HTTP referrers)
- [ ] Verify the map renders on the contact page at `/contact`

---

## SEO & Metadata

- [ ] Review `dictionaries/en.json` → `metadata` section — update the title and description with your final copy
- [ ] Review `dictionaries/nl.json` → `metadata` section — same for the Dutch version
- [ ] Add a `favicon.ico` to the `app/` directory
- [ ] Generate a `robots.txt` (Next.js creates one automatically, but verify it's correct)

---

## Domain & DNS

- [ ] Add your custom domain in **Vercel → Settings → Domains**
- [ ] Configure DNS records at your domain registrar (Vercel will give you the exact values)
- [ ] Enable HTTPS (Vercel auto-provisions SSL via Let's Encrypt)

---

## Final Checks

- [ ] Run `npm run build` locally — confirm zero errors
- [ ] Deploy to Vercel and test in production:
  - [ ] Homepage loads
  - [ ] Room listing and detail pages work
  - [ ] Calendar shows booked dates correctly
  - [ ] Contact form sends successfully
  - [ ] Booking form sends successfully
  - [ ] Admin login works at `/admin/login`
  - [ ] Admin can create/edit rooms, block dates, and manage iCal sources
  - [ ] Language switcher (EN/NL) works on all pages
  - [ ] iCal sync button works (non-admin)
  - [ ] iCal export URL returns valid `.ics` content
- [ ] Test on mobile (responsive layout)
- [ ] Set up a monitoring/uptime check (e.g., Vercel Analytics, a free uptime monitor)

---

## Notes

- **Vercel Hobby plan limits**: 100 GB bandwidth/month, 6,000 build minutes/month. If you expect heavy traffic, consider the Pro plan ($20/month), which also unlocks more frequent cron intervals if you want sync more than once a day.
- **Admin panel**: not publicly linked from the site — only accessible by navigating directly to `/admin/login`. This is intentional for security.
- **Database backups**: Vercel Postgres and Turso both include automated backups. If you self-host a database, set up your own backup schedule.
