# Leonida Companion

Unofficial, fan-made, mobile-first companion web app: cheat lookups, a radio song finder, a stylized map with progress tracking, and a deals page. Built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4. No login, no database.

> Unofficial fan site. Not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto and related marks belong to their owners.

## Setup

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # every variable is optional
npm run dev                  # http://localhost:3000
```

Checks (run before every commit):

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Project rules (content, design tokens, technical rules) live in `CLAUDE.md`.

## Project Layout

| Path | What lives there |
| --- | --- |
| `src/data/cheats.ts`, `radio.ts`, `pins.ts` | All game data. Every record has `status`, `lastVerified`, optional `sourceUrl`. |
| `src/config/site.ts` | Site name, URL, description, disclaimer, contact email. |
| `src/config/monetization.ts` | Affiliate, ads and analytics settings (from env vars). |
| `src/config/regions.ts` | Map regions and colors. |
| `src/app/api/submit/route.ts` | Discovery submission endpoint. |
| `public/sw.js`, `public/offline.html` | Service worker and offline fallback. |

## Environment Variables

All are optional and documented in `.env.example`. A missing affiliate URL or disabled ads means the component renders nothing in production (and a dashed "Dev only" placeholder in development).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (canonical URLs, sitemap, OG images). Falls back to `http://localhost:3000`. |
| `NEXT_PUBLIC_AFF_PSN_URL`, `NEXT_PUBLIC_AFF_XBOX_URL`, `NEXT_PUBLIC_AFF_SSD_URL`, `NEXT_PUBLIC_AFF_DUALSENSE_URL`, `NEXT_PUBLIC_AFF_XBOX_STORAGE_URL` | Affiliate links on /deals. |
| `NEXT_PUBLIC_ADS_ENABLED` | `true` renders reserved ad slots. No ad script ships; wire a CMP first. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_UMAMI_SCRIPT_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Optional analytics (production only). |
| `SUBMISSION_WEBHOOK_URL` | Server-only. Discovery submissions are POSTed here as JSON (e.g. a Slack/Discord/Zapier webhook). Without it, submissions are only logged. |

`NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.

## Updating Data After Launch

Data lives in plain TypeScript files under `src/data/`. Edit, run the checks, commit, deploy.

- **Status rules:** set `status: "confirmed"` only when an entry is verified in-game or by an official Rockstar source. Use `"testing"` for reported but unverified entries and `"sample"` for demo content. Update `lastVerified` (ISO date) whenever you check an entry, and add `sourceUrl` when you have one.
- **Cheats (`cheats.ts`):** replace placeholders with real cheats and fill `inputs.ps5` / `inputs.xbox` with the typed button names. Combos, the copy button, indexing and the sitemap entry all switch on automatically once `status` is `"confirmed"` and the inputs are non-empty.
- **Radio (`radio.ts`):** add tracks and stations, set each track's `status`, and fill each station's `sourceUrl`. Only confirmed tracks appear in structured data and FAQ answers.
- **Map (`pins.ts`):** replace sample pins with real ones. `x`/`y` are coordinates on the stylized 800×1000 map, not in-game coordinates.
- Submissions arrive through the webhook for manual review. Nothing is published automatically; copy verified finds into the data files yourself.

## Deploy to Vercel

1. Push this repo to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repo. The framework preset is detected as Next.js; keep the default build command (`next build`) and output settings.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (your production URL) plus any affiliate, ads, analytics or webhook variables you use.
4. Deploy. Then add your custom domain under **Settings → Domains**, update `NEXT_PUBLIC_SITE_URL` to match, and redeploy.
5. After deploy, check: `/manifest.webmanifest` loads, the site installs to the home screen, `/sw.js` is served with `Cache-Control: no-cache`, `/sitemap.xml` and `/robots.txt` use your domain, and a test submission reaches your webhook.

The service worker only registers in production builds. It is network-first for pages and data (so updated cheats and songs show immediately when online) and cache-first only for hashed `/_next/static/*` files. If you change caching logic in `public/sw.js`, bump `CACHE_VERSION`.

The submission rate limit is in-memory and per serverless instance, so on Vercel it is best-effort. For a real limit, move it to Redis (e.g. Upstash).

## A Note on Monetization and Fan Content

This is a fan site that uses the game's name to describe what it covers. Even with clear disclaimers and no official assets, monetizing a fan site (ads, affiliate links) can still attract a takedown or trademark complaint. Read Take-Two Interactive's and Rockstar Games' current fan-content and intellectual-property policies before enabling ads or affiliates, keep the disclaimer visible, and never use official logos, art, screenshots or lyrics.

## Post-Launch Checklist

- [ ] Verify entries in-game and set their `status` to `"confirmed"` (with `lastVerified` and `sourceUrl`).
- [ ] Replace the 12 placeholder cheats with real, verified combos.
- [ ] Replace the sample map pins with real, verified locations.
- [ ] Add Rockstar's official music page URL as `sourceUrl` for every radio station; verify host names (e.g. Alex Consani's surname) and the testing tracks.
- [ ] Replace `contactEmail` in `src/config/site.ts` with a real inbox.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain.
- [ ] Set `SUBMISSION_WEBHOOK_URL` and send a test submission.
- [ ] Review Take-Two's fan-content policy, then apply for affiliate programs (Amazon Associates, G2A, Eneba) and add the URLs.
- [ ] Apply for an ad network only after wiring a consent management platform (CMP) in `ConsentPlaceholder`; then set `NEXT_PUBLIC_ADS_ENABLED=true`.
- [ ] Optionally enable Plausible or Umami analytics.
