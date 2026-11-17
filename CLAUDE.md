# Leonida Companion — project rules

Unofficial, mobile-first fan companion web app for GTA VI (release Thu Nov 19, 2026, PS5 / Xbox Series X|S).
Next.js 15 App Router + TypeScript (strict) + Tailwind v4 (CSS-first `@theme` in `src/app/globals.css`).
Work phase by phase. After each phase: `npx tsc --noEmit && npm run lint && npm run build`, fix all, commit, STOP and report (<15 lines). Re-read this file at the start of every phase.

## 0. Content rules (non-negotiable)
- Unofficial fan site. Footer + /about carry: "Unofficial fan site. Not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto and related marks belong to their owners." (`siteConfig.disclaimer`)
- No Rockstar logos, "VI" mark, graffiti wordmark, game art, screenshots, lyrics. Text + ORIGINAL SVG/CSS art only. Site name is never "GTA 6"/"Grand Theft Auto".
- Every record in `src/data/*.ts` has `status: "confirmed" | "testing" | "sample"`, `lastVerified` (ISO date), optional `sourceUrl`. UI always shows a status badge. Never present testing/sample as confirmed. Each data file starts with: "Update this file after launch; set status to confirmed only when verified in-game or from an official Rockstar source."
- Site name/domain/description in `src/config/site.ts` (`siteConfig`). Base URL from `NEXT_PUBLIC_SITE_URL` (fallback http://localhost:3000) → `metadataBase`.
- Affiliate/ad/analytics IDs from env vars documented in `.env.example`. Missing var → render nothing in production, clearly marked dev-only placeholder in development.
- Never invent game facts. Unknown → "Not verified yet".
- Cheats: all placeholders (status "testing", empty inputs). Inputs render only if `status === "confirmed"` AND non-empty. Copy button hidden for unconfirmed. Unconfirmed detail pages are `noindex` and excluded from sitemap.
- Radio: tracks are a PREVIEW SAMPLE; show "Preview sample, not the full playlist". Don't claim voice-actor ↔ persona mapping unless the data notes it.
- Deals/affiliates live only on /deals (never inside cheat/radio lists). No prices, discounts, "best"/"cheapest".

## 1. Design system (style of /reference/gta-site.png — never its assets)
Dark, clean, modern; pink accent; muted purple borderless cards; generous spacing. NOT retrowave (no sun/palms-sunset/grid/scanlines/glows/uppercase poster headings).
Tailwind theme colors (globals.css `@theme`): `bg` #0B0A1C (+ one faint top radial #1B1740→transparent), `card` #25224B, `card-hover` #2F2B5C, `fg` #FFFFFF (= token "text"), `muted` #B9B5D6 (= "text-muted"), `accent` #FF9CCB (text on pink = `on-accent` #0B0A1C), `line` #2A2750, `line-strong` #3A3568, `badge-dark` #1A1830.
- `--brand-gradient`: linear-gradient(135deg,#FF4FA3,#8A4DFF 55%,#FF9A3C) — ONLY logo mark, progress bars, blurred hero orb.
- Radius: cards 20px (`rounded-card`), buttons/pills 999px, inputs 14px (`rounded-input`). No shadows, no glows. Focus: 2px accent outline, 2px offset.
- Station colors (dot/badge text/thumb tint only): Cocoteo FM #FF7A1A, Flash FM #FF2E93, Back Country Radio #D9A441, AfroBank FM #2EE6A6, The Chamber 106.6 #E11D2E, Dirty South Classics #A855F7.
- Region colors (map only): Vice City #FF2E93, Leonida Keys #19E3FF, Grassrivers #3DDC84, Port Gellhorn #FFB547, Mount Kalaga #7B5CFF, Ambrosia #FF6B5E.
- Type: Figtree 400/500/600 everywhere, title case, no uppercase headings, 16px/1.55. Page/section title `.page-title` 40–48px clamp, 500, accent. Card title `.card-title` 20–22px, 500, lh 1.3. Meta 16px muted. JetBrains Mono only for cheat codes, combo text, badges.
- Section header: pink title left, white "View all →" (inline SVG arrow) right.
- Card grid: 3/2/1 cols, gap 24px. Card = 16:9 `<Thumb>` on top (full-bleed), title, meta pinned to bottom (flex col, equal heights). Padding 32px desktop / 20px mobile. Hover/focus-visible: `card-hover` bg + translateY(-2px), 150ms.
- `<Thumb accent seed />`: original SVG gradient mesh + abstract skyline/palm silhouette. No images.
- Header: sticky, logo mark left, two-bar hamburger right → full-screen native `<dialog>` menu (4 tabs + About, Privacy, Affiliate Disclosure). Pink "Submit a Discovery" pill only once Phase 4 exists.
- Mobile (<768px): fixed bottom tab bar 64px + safe-area, rgba(11,10,28,0.9) + blur, 1px top border #2A2750; tabs Cheats/Radio/Map/Deals, 24px SVG icon + 11px label, ≥48px targets, active = accent. Content gets bottom padding.
- Footer: disclaimer in outlined pill container (1px border, radius 999px desktop / 24px mobile), then links /about /privacy /affiliate-disclosure.
- Buttons: `.btn-primary` (accent fill, dark text, 600, pill), `.btn-secondary` (transparent, 1px #3A3568, hover border accent).
- Status badges (11px mono uppercase pill): Confirmed #3DDC84 on 12% green; "Testing at Launch" #FFB547 on 12% amber; Sample #A78BFA dashed border.
- Search input 52px, card bg, no border, magnifier, clear button, 16px font, accent focus.
- Empty state: small SVG + one line + CTA. Motion only: 150ms hover/focus, toggle thumb slide, drawer slide; all off under prefers-reduced-motion.
- Max content width 1100px. Mobile-first (390 → 768 → 1280).

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
