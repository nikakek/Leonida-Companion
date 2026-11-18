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
| `src/data/cheats.ts`, `radio.ts`, `pins.ts`, `news.ts` | All game data. Every record has `status`, `lastVerified`, optional `sourceUrl`. |
| `src/config/site.ts` | Site name, URL, description, disclaimer, contact email. |
| `src/config/monetization.ts` | Affiliate, ads and analytics settings (from env vars). |
| `src/config/regions.ts` | Map regions and colors. |
| `src/app/api/submit/route.ts`, `src/lib/rateLimit.ts` | Discovery submission endpoint and its rate limit. |
| `src/app/ads.txt/route.ts` | `/ads.txt` from env vars. |
| `next.config.ts` | Security headers. |
| `public/sw.js`, `public/offline.html` | Service worker and offline fallback. |

## Environment Variables

All are optional and documented one by one in `.env.example`. A missing or malformed value means the related feature renders nothing in production (and a dashed "Dev only" placeholder in development).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (canonical URLs, sitemap, robots.txt, share images). Falls back to `http://localhost:3000`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact inbox shown on /privacy. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console "HTML tag" verification value. |
| `NEXT_PUBLIC_AFF_PSN_URL`, `NEXT_PUBLIC_AFF_XBOX_URL`, `NEXT_PUBLIC_AFF_SSD_URL`, `NEXT_PUBLIC_AFF_DUALSENSE_URL`, `NEXT_PUBLIC_AFF_XBOX_STORAGE_URL` | Affiliate links on /deals (https only). With none set, /deals is noindex and left out of the sitemap. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID (`ca-pub-...`). Loads the AdSense script and generates `/ads.txt`. |
| `NEXT_PUBLIC_ADSENSE_SLOT` | AdSense ad unit ID. With both set, the banner slots on /cheats, /radio and /deals show ads. |
| `ADS_TXT` | Optional full `ads.txt` content (lines separated by `\n`) for other ad networks. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (+ optional `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL`) or `NEXT_PUBLIC_UMAMI_SCRIPT_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Optional analytics (production only). |
| `SUBMISSION_WEBHOOK_URL` | Server-only. Discovery submissions are POSTed here as JSON (e.g. a Discord/Slack/Zapier webhook). Without it, submissions are only logged. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Server-only. Shared rate limit for submissions. Without both, the limit is in-memory per instance. |

`NEXT_PUBLIC_*` values and `ADS_TXT` are read at build time, so redeploy after changing them.

## Updating Data After Launch

All game data is plain TypeScript in `src/data/`. The loop is always: edit the file, run the checks, commit, deploy. Each file has a copy-paste template in a comment above its list.

**The one rule:** set `status: "confirmed"` only when you verified the entry in-game or from an official Rockstar source. Use `"testing"` for reported but unchecked entries. Always set `lastVerified` to the day you checked (ISO date, `"2026-11-19"`); the "Last updated" date on each page and in the sitemap comes from the newest `lastVerified` in that file.

### Add or confirm a cheat (`src/data/cheats.ts`)

Replace the cheat's `placeholder(...)` line with a full entry (keep its `id` and `slug`):

```ts
{
  id: "c02",
  slug: "lower-wanted-level",
  title: "Lower Wanted Level",
  category: "Player",                    // "Player" | "Weapons" | "Vehicles" | "World"
  description: "One sentence on what it does.",
  inputs: { ps5: ["up", "triangle", "l1", "cross"], xbox: ["up", "y", "lb", "a"] },
  status: "confirmed",
  lastVerified: "2026-11-19",
  sourceUrl: "https://...",              // optional
},
```

Button names are type-checked (`triangle circle cross square l1 l2 r1 r2` / `y b a x lb lt rb rt` / `up down left right`). Once `status` is `"confirmed"` and both input lists are filled, the combo badges, copy button, page indexing and sitemap entry switch on automatically. For a brand-new cheat, add a new entry with a new `id` (`c13`, ...) and a new `slug`.

### Add or confirm a track (`src/data/radio.ts`)

Add a line to the station's `tracks`:

```ts
track("Artist", "Song Title", "confirmed", "2026-11-19"),
```

To confirm an existing `"testing"` track, change its status and add the date as the fourth argument. Confirmed tracks appear automatically in the station page description, FAQ and structured data. When you have the official Rockstar music page, put its URL in the station's `sourceUrl`.

### Add or confirm a map pin (`src/data/pins.ts`)

```ts
{
  id: "p13",                             // unique, never reuse
  title: "Rooftop Mural",
  region: "vice-city",                   // see src/config/regions.ts
  category: "easter-egg",                // "easter-egg" | "collectible" | "stunt-jump" | "safe-house"
  description: "Where it is and how to reach it.",
  x: 640, y: 500,                        // position on the 800 x 1000 stylized map
  status: "confirmed",
  lastVerified: "2026-11-19",
},
```

Delete the `sample(...)` pins once you have real ones. The "samples" wording on /map updates itself from the statuses.

Submissions arrive through the webhook for manual review. Nothing is published automatically; copy verified finds into the data files yourself.

## Deploy to Vercel

1. Push this repo to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repo. The framework preset is detected as Next.js; keep the default build command (`next build`) and output settings.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (your production URL) plus any affiliate, ads, analytics or webhook variables you use.
4. Deploy. Then add your custom domain under **Settings → Domains**, update `NEXT_PUBLIC_SITE_URL` to match, and redeploy.
5. After deploy, check: `/manifest.webmanifest` loads, the site installs to the home screen, `/sw.js` is served with `Cache-Control: no-cache`, `/sitemap.xml` and `/robots.txt` use your domain, `/ads.txt` shows your seller line (if ads are on), and a test submission reaches your webhook.

The service worker only registers in production builds. It is network-first for pages and data (so updated cheats and songs show immediately when online) and cache-first only for hashed `/_next/static/*` files. If you change caching logic in `public/sw.js`, bump `CACHE_VERSION`.

The submission rate limit (5 per 10 minutes per IP) uses Upstash Redis when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set. Without them it is in-memory per serverless instance, which on Vercel is best-effort only.

Ads: the banner slots use Google AdSense. EU/UK/Swiss visitors must see a consent message before personalized ads; turn on Google's own message under **AdSense → Privacy & messaging** (it is delivered by the AdSense script, no code change needed).

## A Note on Monetization and Fan Content

This is a fan site that uses the game's name to describe what it covers. Even with clear disclaimers and no official assets, monetizing a fan site (ads, affiliate links) can still attract a takedown or trademark complaint. Read Take-Two Interactive's and Rockstar Games' current fan-content and intellectual-property policies before enabling ads or affiliates, keep the disclaimer visible, and never use official logos, art, screenshots or lyrics.

## Go-Live Checklist

- [ ] Deploy and connect the domain; set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
- [ ] Set `NEXT_PUBLIC_CONTACT_EMAIL`.
- [ ] Set `SUBMISSION_WEBHOOK_URL` and send a test submission.
- [ ] Create an Upstash Redis database and set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
- [ ] Verify the site in Google Search Console (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) and submit `/sitemap.xml`.
- [ ] Verify entries in-game and set their `status` to `"confirmed"` (see "Updating Data After Launch").
- [ ] Add Rockstar's official music page URL as `sourceUrl` for every radio station; verify host names (e.g. Alex Consani's surname) and the testing tracks.
- [ ] Review Take-Two's fan-content policy, then apply for affiliate programs and add the URLs.
- [ ] Apply for AdSense once real data is live; set `NEXT_PUBLIC_ADSENSE_CLIENT`, then `NEXT_PUBLIC_ADSENSE_SLOT`, and enable the consent message.
- [ ] Optionally enable Plausible or Umami analytics.
