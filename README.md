# Leonida Companion

Unofficial, fan-made, mobile-first companion web app. Next.js 15 (App Router), TypeScript, Tailwind CSS v4.

> Unofficial fan site. Not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto and related marks belong to their owners.

## Setup

```bash
npm install
cp .env.example .env.local   # all variables are optional
npm run dev
```

Checks: `npx tsc --noEmit && npm run lint && npm run build`.

Project rules live in `CLAUDE.md`. Data lives in `src/data/*.ts`.

## Environment Variables

All are optional and documented in `.env.example`. A missing affiliate URL or disabled ads means the component renders nothing in production (and a dashed "Dev only" placeholder in development).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (canonical URLs, metadata). Falls back to `http://localhost:3000`. |
| `NEXT_PUBLIC_AFF_PSN_URL`, `NEXT_PUBLIC_AFF_XBOX_URL`, `NEXT_PUBLIC_AFF_SSD_URL`, `NEXT_PUBLIC_AFF_DUALSENSE_URL`, `NEXT_PUBLIC_AFF_XBOX_STORAGE_URL` | Affiliate links on /deals. |
| `NEXT_PUBLIC_ADS_ENABLED` | `true` renders reserved ad slots. No ad script ships; wire a CMP first. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_UMAMI_SCRIPT_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Optional analytics (production only). |
| `SUBMISSION_WEBHOOK_URL` | Server-only. Where discovery submissions are forwarded (Phase 4). |

`NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.

## Deploy to Vercel

1. Push this repo to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repo. The framework preset is detected as Next.js; keep the default build command (`next build`) and output settings.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (your production URL, e.g. `https://your-domain.example`) plus any affiliate, ads or analytics variables you use. Set them for Production (and Preview if wanted).
4. Deploy. Then add your custom domain under **Settings → Domains** and update `NEXT_PUBLIC_SITE_URL` to match, then redeploy.
5. After deploy, check: `/manifest.webmanifest` loads, the site installs to the home screen, `/sw.js` is served with `Cache-Control: no-cache`, and the footer disclaimer is visible.

The service worker only registers in production builds. It is network-first for pages and data (so updated cheats and songs show immediately when online) and cache-first only for hashed `/_next/static/*` files. If you change caching logic in `public/sw.js`, bump `CACHE_VERSION`.
