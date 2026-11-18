# Leonida Companion — project rules

Unofficial, mobile-first fan companion web app for GTA VI (release Thu Nov 19, 2026, PS5 / Xbox Series X|S).
Next.js 15 App Router + TypeScript (strict) + Tailwind v4 (CSS-first `@theme` in `src/app/globals.css`).
Work phase by phase. After each phase: `npx tsc --noEmit && npm run lint && npm run build`, fix all, commit, STOP and report (<15 lines). Re-read this file at the start of every phase.

## 0. Content rules (non-negotiable)
- Unofficial fan site. Footer + /about carry: "Unofficial fan site. Not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto and related marks belong to their owners." (`siteConfig.disclaimer`)
- No Rockstar logos, "VI" mark, graffiti wordmark, game art, screenshots, lyrics. Text + ORIGINAL SVG/CSS art only. Site name is never "GTA 6"/"Grand Theft Auto".
- Every record in `src/data/*.ts` has `status: "confirmed" | "testing" | "sample"`, `lastVerified` (ISO date), optional `sourceUrl`. UI always shows a status badge. Never present testing/sample as confirmed. Each data file starts with: "Update this file after launch; set status to confirmed only when verified in-game or from an official Rockstar source."
- Site name/domain/description in `src/config/site.ts` (`siteConfig`). Base URL from `NEXT_PUBLIC_SITE_URL` (fallback http://localhost:3000) → `metadataBase`.
- Affiliate/ad/analytics IDs from env vars documented in `.env.example` and parsed in `src/config/monetization.ts` (affiliate URLs must be https; AdSense IDs are pattern-checked). Missing or malformed var → render nothing in production, clearly marked dev-only placeholder in development. `/ads.txt` comes from `ADS_TXT` or the AdSense publisher ID (404 when neither is set). `/deals` is noindex and out of the sitemap while no affiliate URL is set.
- Never invent game facts. Unknown → "Not verified yet". Hub pages (cheats, radio, map, stations) show `<VerificationNote>` with the newest `lastVerified` date (`latestVerified()` in `src/lib/verification.ts`); sitemap `lastModified` uses the same dates.
- Cheats: all placeholders (status "testing", empty inputs). Inputs render only if `status === "confirmed"` AND non-empty. Copy button hidden for unconfirmed. Unconfirmed detail pages are `noindex` and excluded from sitemap.
- Radio: tracks are a PREVIEW SAMPLE; show "Preview sample, not the full playlist". Don't claim voice-actor ↔ persona mapping unless the data notes it.
- Deals/affiliates live only on /deals (never inside cheat/radio lists). No prices, discounts, "best"/"cheapest".

## 1. Design system ("Vice City at night"; tokens in `globals.css` `@theme`)
Near-black, dense, HUD-like; hot pink primary, cyan/amber/violet as supporting accents. Original art only: never the assets or look-alikes of /reference/gta-site.png or official key art (no characters, cars, weapons, sunsets-with-palms poster scenes).
Tailwind theme colors: `bg` #08080D (+ two faint top radials, violet left / pink right), `card` #12121A, `card-hover` #1A1A25, `navy` #0E1424, `fg` #F4F2F8, `muted` #A3A1B8, `faint` #6E6C85, `accent` #FF4D9D (hover #FF70B1; text on pink = `on-accent` #08080D), `cyan` #3DE3F0, `amber` #FFB547, `violet` #9D7BFF, `line` #22222F, `line-strong` #34344A, `ok` #3DDC84, `warn` #FFB547, `sample` #A78BFA, `danger` #FF6B81. Inset wells (inputs, toggles): #0B0B12.
- `--sunset` (90deg #FF4D9D → #FF7A59 → #FFB547) and `--brand-gradient` (same stops, 135deg): ONLY logo mark, progress fills, `.sunset-line`, hero horizon line.
- Radius: cards 10px (`rounded-card`), inputs 8px (`rounded-input`), secondary buttons 6px, small tags 4px. Pills (999px) ONLY for `.chip` filters and dots. Primary buttons are chamfered (clip-path on `::before`, `--chamfer`), `.tile` has one chamfered corner.
- Cards/rows have a 1px `line` border. Glow is restrained and pink only: hover/active states (`.card-lift`, `.btn-*`, active chip/nav/toggle, focused field). No large drop shadows, no scanlines, no neon text.
- Focus: 2px accent outline, 2px offset (fields use accent border + 3px ring instead).
- Station colors (dot/stripe/badge text/thumb tint only): Cocoteo FM #FF7A1A, Flash FM #FF2E93, Back Country Radio #D9A441, AfroBank FM #2EE6A6, The Chamber 106.6 #E11D2E, Dirty South Classics #A855F7.
- Region colors (map, progress, stripes): Vice City #FF2E93, Leonida Keys #19E3FF, Grassrivers #3DDC84, Port Gellhorn #FFB547, Mount Kalaga #7B5CFF, Ambrosia #FF6B5E.
- Type: Space Grotesk 400–600 for body/UI (16px/1.5). Bebas Neue 400 uppercase for display: `.display`, `.page-title` (48–76px clamp, `fg`), `.section-title` (30–40px), station/tile names. JetBrains Mono for cheat codes, combos, badges, `.eyebrow` (11px uppercase, accent), `.meta`, nav labels. `.card-title` 17px/600. Write copy in title case in source; uppercase comes from CSS.
- Section header (`<SectionHeader>`): eyebrow + display title left, mono "View all" + accent arrow right.
- Lists use `.stripe-row` (3px colored left stripe) in 1/2/3/4-col grids, gap 10–16px; `.panel` for static boxes; `.card-lift` for interactive cards (hover: `card-hover`, border `line-strong`, translateY(-2px), 150ms).
- `<Thumb accent seed />`, `<HeroSkyline />`, `<HeroArt />`: original generated SVG only. No raster images anywhere (`public/` holds only sw.js and offline.html).
- Header: sticky, transparent at top then filled on scroll; wordmark left; inline `<DesktopNav>` (≥768px, active = underline); pink "Submit a Discovery" (desktop) + two-bar hamburger → full-screen native `<dialog>` menu (4 tabs + About, Privacy, Affiliate Disclosure). Mobile floating "Submit" button. Both open the single `<SubmitDiscovery>` dialog via `OPEN_SUBMIT_EVENT` (`SubmitTrigger`).
- Mobile (<768px): fixed bottom tab bar 64px + safe-area, rgba(8,8,13,0.94) + blur, 1px top border; tabs Cheats/Radio/Map/Deals, 24px SVG icon + 10px mono label, ≥48px targets, active = accent + top tick. Content gets bottom padding.
- Layout: full-width with the shared `--gutter` (16 / 32 / 48 / 64px); text columns capped at `max-w-2xl`. Home hero is full-bleed and full-height.
- Footer: logo mark + disclaimer + Amazon statement left, two link columns right, mono copyright row.
- Buttons: `.btn-primary` (accent fill, dark text, 600, chamfered), `.btn-secondary` (transparent, 1px `line-strong`, hover border accent), `.btn-sm`, `.icon-btn` (44px).
- Status badges (`<StatusBadge>`, 10px mono uppercase, 4px radius, dot + label): Confirmed #3DDC84; "Testing at Launch" #FFB547; Sample #A78BFA dashed border.
- Unverified content always carries `<VerificationNote>` ("Not verified yet, updating at launch" + last-updated date).
- Search input 50px (56px hero variant), well bg, 1px border, magnifier, clear button, "/" shortcut, 16px font, accent focus.
- Empty state: small SVG + one line + CTA. Motion only: 150ms hover/focus, toggle thumb slide, sheet/drawer/menu slide, skeleton shimmer; all off under prefers-reduced-motion.
- Mobile-first (390 → 768 → 1280).

## 2. Technical rules
- Minimal deps: no UI kits, map/icon/state libs, zod. Inline SVG only. Fonts via `next/font/google`. Never upgrade Next past 15.
- `useLocalStorage` (`src/hooks/useLocalStorage.ts`): `useSyncExternalStore`; server snapshot = default; `getSnapshot` returns a STABLE reference (raw-string cache + memoized parse); custom event on write for same-tab sync; try/catch all storage access.
- localStorage-dependent UI renders a stable default first, no layout shift.
- Countdown renders after mount only; target Nov 19, 2026 local midnight; afterwards "Out now". No exact release time.
- Modals/drawers/menus: native `<dialog>` + `showModal()`, CSS backdrop, restore focus to trigger.
- Server components by default; `'use client'` only for toggle, search, map, drawer/modal, storage hooks, countdown.
- Next 15: `params` is a Promise. `generateStaticParams` + `dynamicParams = false` for `/cheats/[slug]`, `/radio/[station]`. Theme color in `export const viewport`.
- Crawlable server-rendered text on every detail page.
- Strict TS, no `any`, no unused code, no ESLint disables, zero build warnings.

## 3. Map and submissions (Phase 4)
- Map is dependency-free SVG (`src/components/map/*`, viewBox 0 0 800 1000). Zoom animates the viewBox with rAF (jump under reduced motion); pins/labels are scaled by map-units-per-px so they stay constant size. Pin shapes differ by category (not color-only); 44px hit targets.
- `src/data/pins.ts`: all pins `status: "sample"` until verified.
- `/api/submit`: hand-written validation shared with the client (`src/lib/submission.ts`), 8 KB cap, same-origin check, honeypot (silent 200), rate limit 5/10 min via `src/lib/rateLimit.ts` (Upstash Redis REST when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set, in-memory fallback otherwise; keys are hashed IPs), webhook with 5s timeout. Submissions are never auto-published.
- Security headers for every route live in `next.config.ts` (no `script-src` CSP: pages are static and ad/analytics scripts are third-party).
