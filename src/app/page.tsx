import Link from "next/link";
import type { CSSProperties } from "react";
import { Countdown } from "@/components/Countdown";
import { NavGlyph } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { QuickSearch } from "@/components/QuickSearch";
import { SectionHeader } from "@/components/SectionHeader";
import { HeroArt } from "@/components/home/HeroArt";
import { HeroSkyline } from "@/components/home/HeroSkyline";
import { HomeSession } from "@/components/home/HomeSession";
import { siteConfig, type NavIcon } from "@/config/site";
import { cheats } from "@/data/cheats";
import { pins } from "@/data/pins";
import { stations, trackAnchor } from "@/data/radio";
import { absoluteUrl } from "@/lib/seo";

const trackCount = stations.reduce((total, station) => total + station.tracks.length, 0);
const verifiedCheats = cheats.filter((cheat) => cheat.status === "confirmed").length;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  inLanguage: "en",
};

const tiles: { href: string; title: string; icon: NavIcon; accent: string; stat: string; blurb: string }[] = [
  {
    href: "/cheats",
    title: "Cheats",
    icon: "cheats",
    accent: "#FF4D9D",
    stat: `${cheats.length} slots · ${verifiedCheats} verified`,
    blurb: "PS5 and Xbox combos, starred favorites.",
  },
  {
    href: "/radio",
    title: "Radio",
    icon: "radio",
    accent: "#3DE3F0",
    stat: `${stations.length} stations · ${trackCount} tracks`,
    blurb: "Which station plays that song.",
  },
  {
    href: "/map",
    title: "Map",
    icon: "map",
    accent: "#FFB547",
    stat: `${pins.length} sample pins`,
    blurb: "Regions, secrets and your progress.",
  },
  {
    href: "/deals",
    title: "Deals",
    icon: "deals",
    accent: "#9D7BFF",
    stat: "Affiliate · labeled",
    blurb: "Gift cards, storage, controllers.",
  },
];

// Example queries taken straight from existing data (a real song, a real station, a real cheat slot).
const firstConfirmedTrack = stations.flatMap((s) => s.tracks).find((t) => t.status === "confirmed");
const suggestions = [firstConfirmedTrack?.title, stations[1]?.name, cheats[1]?.title].filter(
  (item): item is string => Boolean(item),
);

// Confirmed tracks only, one per station first, for the "On Air" list.
const onAir = stations
  .map((station) => ({ station, track: station.tracks.find((t) => t.status === "confirmed") }))
  .filter((item): item is { station: (typeof stations)[number]; track: NonNullable<typeof item.track> } => Boolean(item.track));

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />

      {/* Full-bleed, full-height hero: starts under the transparent sticky header. */}
      <section
        aria-labelledby="hero-title"
        className="relative isolate -mx-[var(--gutter)] -mt-[calc(var(--header-h)+env(safe-area-inset-top)+var(--main-pt))] flex min-h-[100svh] flex-col overflow-hidden bg-[#08080d]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_85%_20%,rgba(255,77,157,0.16),transparent_70%),radial-gradient(ellipse_50%_45%_at_5%_10%,rgba(157,123,255,0.16),transparent_70%),radial-gradient(ellipse_80%_40%_at_50%_100%,rgba(255,122,89,0.14),transparent_75%)]"
        />
        <HeroSkyline className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[30svh] w-full opacity-90 md:h-[42svh]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,8,13,0)_55%,rgba(8,8,13,0.35)_80%,#08080d_100%)]"
        />

        <div className="flex flex-1 flex-col gap-5 px-[var(--gutter)] pt-[calc(var(--header-h)+env(safe-area-inset-top)+1rem)] pb-[calc(var(--bottom-nav-h)+4.5rem)] md:gap-8 md:pt-[calc(var(--header-h)+2.5rem)] md:pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <Countdown />
            <span className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">Unofficial field guide</span>
          </div>

          <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] xl:gap-12">
            <div className="min-w-0">
              <h1
                id="hero-title"
                className="display max-w-5xl text-[clamp(2.6rem,1.2rem+6.6vw,8.75rem)] leading-[0.86] lg:text-[clamp(4rem,1rem+5.4vw,8.5rem)]"
              >
                Your Second Screen <span className="block text-accent">for Leonida</span>
              </h1>
              <p className="mt-3 max-w-xl text-[15px] text-muted md:mt-5 md:text-[18px]">
                An unofficial GTA 6 companion: cheats, radio songs and map secrets in seconds, built for your phone while you play.
              </p>
              <div className="mt-5 max-w-3xl md:mt-8">
                <QuickSearch suggestions={suggestions} />
              </div>
            </div>
            {/* Decorative original SVG art (desktop only). */}
            <div aria-hidden="true" className="relative hidden min-w-0 justify-center lg:flex">
              <HeroArt className="h-auto max-h-[min(58svh,640px)] w-full" />
            </div>
          </div>

          <nav aria-label="Main features">
            <ul className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
              {tiles.map((tile) => (
                <li key={tile.href} className="flex min-w-0">
                  <Link
                    href={tile.href}
                    className="tile group flex min-h-[4.5rem] min-w-0 flex-1 items-center gap-3 p-3 md:min-h-28 md:gap-4 md:p-5"
                    style={{ "--tile-accent": tile.accent } as CSSProperties}
                  >
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-md border border-line-strong transition-colors duration-150 group-hover:border-current md:size-12"
                      style={{ color: tile.accent }}
                    >
                      <NavGlyph icon={tile.icon} size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="display block text-[26px] leading-none md:text-[36px]">{tile.title}</span>
                      <span className="mt-1 hidden text-[13px] text-muted xl:block">{tile.blurb}</span>
                      <span
                        className="mt-1 block truncate font-mono text-[10px] tracking-normal uppercase md:text-[11px] md:tracking-[0.06em]"
                        style={{ color: tile.accent }}
                      >
                        {tile.stat}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section aria-labelledby="session-title" className="mt-10 md:mt-14">
        <SectionHeader id="session-title" eyebrow="Saved on this device" title="Your Session" />
        <HomeSession />
      </section>

      <section aria-labelledby="dial-title" className="mt-12 md:mt-16">
        <SectionHeader id="dial-title" eyebrow={`${stations.length} stations`} title="Station Dial" href="/radio" linkLabel="All radio" />
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 2xl:grid-cols-6">
          {stations.map((station, index) => (
            <li key={station.slug} className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto">
              <Link
                href={`/radio/${station.slug}`}
                className="stripe-row flex h-full min-h-28 flex-col justify-between gap-3 p-4 pl-5"
                style={{ "--stripe": station.accent } as CSSProperties}
              >
                <span className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em] text-faint uppercase">
                  <span>CH {String(index + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: station.accent, boxShadow: `0 0 10px ${station.accent}` }} />
                </span>
                <span>
                  <span className="display block text-[28px] leading-none">{station.name}</span>
                  <span className="mt-1 block truncate text-[13px] text-muted">{station.genre}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {onAir.length > 0 ? (
        <section aria-labelledby="onair-title" className="mt-12 md:mt-16">
          <SectionHeader id="onair-title" eyebrow="Confirmed · preview sample" title="On Air" href="/radio#song-index-title" linkLabel="Song index" />
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {onAir.map(({ station, track }) => (
              <li key={station.slug} className="min-w-0">
                <Link
                  href={`/radio/${station.slug}#${trackAnchor(track)}`}
                  className="stripe-row flex min-h-16 items-center gap-3 px-4 py-3 pl-5"
                  style={{ "--stripe": station.accent } as CSSProperties}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{track.title}</span>
                    <span className="block truncate text-[13px] text-muted">{track.artist}</span>
                  </span>
                  <span className="max-w-[42%] shrink-0 truncate font-mono text-[11px] tracking-[0.08em] uppercase" style={{ color: station.accent }}>
                    {station.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
