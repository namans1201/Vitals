# Deployment checklist — Vitals (Vercel + Neon)

Follow in order. Nothing here creates accounts or clicks dashboards for you —
do those steps yourself.

## 1. Push to GitHub

1. Create a new (private) GitHub repo.
2. `git remote add origin <your-repo-url>`
3. `git push -u origin main` (or whatever your default branch is).

## 2. Create the Neon project

1. neon.tech → New Project. Pick a region close to you.
2. On the project's **Connect** page, copy two connection strings for the
   `vitals` database:
   - **Pooled connection** (checkbox "Pooled connection" checked) →
     this is your `DATABASE_URL`.
   - **Direct connection** (same checkbox unchecked) →
     this is your `DIRECT_URL`.
   Both already include `?sslmode=require`; keep that.

## 2a. Keep the function region and the database region together

`vercel.json` pins `"regions": ["sin1"]` (Singapore) to match the Neon
project's region. **If you ever move the database, move this too.**

This is not a micro-optimisation. Vercel's default function region is
`iad1` (Washington DC). With the database in Singapore, that was measured
at ~230ms *per query* — and these pages issue their queries in sequential
waves, so the workout page paid it several times over:

| Request | iad1 function, sin1 database |
|---|---|
| static file (CDN, no function) | 122ms |
| `/login` (function, zero queries) | 320ms |
| `/plan` (~2 queries) | 560ms |
| `/workout` (7-9 queries) | 1420ms |

The same pages against a local database were 14-26ms. Colocating the
function with the database is what closes that gap; no amount of query
tuning in the app can, because the cost is the speed of light, not the
work.

Neon's region list has no Mumbai option, so Singapore is the closest
available to India — and it's the *function-to-database* hop that matters
here, not the browser-to-function one. A page makes one browser round trip
but many database round trips.

## 3. Create the Vercel project

1. vercel.com → Add New → Project → import the GitHub repo from step 1.
2. Framework preset: Next.js (auto-detected). Leave build settings default —
   this repo's `package.json` defines a `vercel-build` script that Vercel
   runs automatically instead of `build`.
3. Don't click Deploy yet — set environment variables first (step 4).

## 4. Set environment variables in Vercel

Project → Settings → Environment Variables. Add each, scoped to
**Production** (and Preview too, if you want preview deploys to work):

| Key | What it is |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (step 2). Used by the app at runtime. |
| `DIRECT_URL` | Neon **direct** connection string (step 2). Used only by `prisma migrate deploy` during build. |
| `APP_PASSWORD` | The single login password for this app. Pick a new one — don't reuse your local dev value. |
| `SESSION_SECRET` | HMAC key that signs the session cookie. Generate a new one (step 5) — don't reuse your local dev value. |
| `IMPORT_BEARER_TOKEN` | Bearer token the sync script presents to `POST /api/import`. Generate a new one (step 5) — don't reuse your local dev value. |

## 5. Generate production secrets

Run locally (don't commit the output, just paste it into Vercel):

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it twice — once for `SESSION_SECRET`, once for `IMPORT_BEARER_TOKEN`.
Pick a fresh `APP_PASSWORD` yourself (not generated, since you'll type it).

## 6. First deploy

Either:
- Click **Deploy** in the Vercel dashboard, or
- From the repo locally: `npx vercel link` then `npx vercel deploy --prod`.

This runs `npm install` (triggers `postinstall: prisma generate`) then
`vercel-build`, which runs `prisma migrate deploy` against `DIRECT_URL`
followed by `next build`. Watch the build logs for the migrate step —
if it fails, `DIRECT_URL` is the most likely culprit (must be the
*unpooled* Neon string).

## 7. Verify

1. Open the deployed URL, confirm the login page loads and the logo/icons
   render (these are served as static `<img>` tags, not `next/image`).
2. Log in with the `APP_PASSWORD` you set in step 4.
3. Confirm a page that reads/writes `DailyLog` or similar works, to prove
   the pooled `DATABASE_URL` connection is good.

## 8. Ongoing deploys

Every subsequent `git push` to the branch Vercel is tracking triggers a new
build, which re-runs `prisma migrate deploy` automatically — so any new
migration you commit is applied on deploy. No manual migration step needed
after the first deploy, as long as `DIRECT_URL` stays set in Vercel.

## Notes / things to double check yourself

- If you ever add `next/image` back, revisit `next.config.ts` — it currently
  has no `images.remotePatterns`, which is fine only because no image is
  optimized by Next today.
- Seeding (`prisma/seed.ts`) is wired into `prisma7.config.ts` but is **not**
  run automatically by `migrate deploy`. If production needs seed data,
  run `npx prisma db seed` yourself once, with `DIRECT_URL` set in your
  shell (or via `vercel env pull` then loading that file).
