import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { Countdown } from "@/components/Countdown";
import { QuickSearch } from "@/components/QuickSearch";
import { SectionHeader } from "@/components/SectionHeader";
import { StationCard } from "@/components/radio/StationCard";
import { cheats } from "@/data/cheats";
import { stations } from "@/data/radio";

const trackCount = stations.reduce((total, station) => total + station.tracks.length, 0);

const tabCards = [
  {
    href: "/cheats",
    title: "Cheats",
    accent: "#FF4FA3",
    blurb: "Search and star cheats for PS5 and Xbox. Combos appear once verified.",
    meta: `${cheats.length} slots · none verified yet`,
  },
  {
    href: "/radio",
    title: "Radio",
    accent: "#8A4DFF",
    blurb: "Find which station plays a song, with hosts and a preview of each station.",
    meta: `${stations.length} stations · ${trackCount} sample tracks`,
  },
  {
    href: "/map",
    title: "Map",
    accent: "#19B8FF",
    blurb: "A stylized map of Leonida with discoveries and progress tracking.",
    meta: "Coming soon",
  },
  {
    href: "/deals",
    title: "Deals",
    accent: "#FF9A3C",
    blurb: "Gift cards, storage and controllers. Clearly labeled affiliate links.",
    meta: "Affiliate links, clearly labeled",
  },
];

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  inLanguage: "en",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <section aria-labelledby="hero-title" className="relative isolate pt-6 pb-14 md:pt-14 md:pb-20">
        <div aria-hidden="true" className="hero-orb -top-10 left-1/2 -z-10 size-[360px] -translate-x-1/2 md:left-[30%] md:size-[520px]" />
        <Countdown />
        <h1
          id="hero-title"
          className="mt-6 max-w-3xl text-[clamp(2.5rem,1.6rem+4vw,4.5rem)] leading-[1.05] font-medium tracking-[-0.02em] text-fg"
        >
          Your Pocket Guide to <span className="text-accent">Leonida</span>
        </h1>
        <p className="mt-5 max-w-xl text-[17px] text-muted md:text-lg">
          Quick lookups for mid-game moments: cheats, radio songs, the map and more. Fan-made and unofficial, with
          every entry labeled by verification status.
        </p>
        <div className="mt-8">
          <QuickSearch />
        </div>
      </section>

      <section aria-labelledby="explore-title" className="mb-16">
        <SectionHeader id="explore-title" title="Explore" />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {tabCards.map((tab) => (
            <li key={tab.href}>
              <Card href={tab.href} title={tab.title} accent={tab.accent} seed={`tab-${tab.title}`} meta={tab.meta}>
                <p className="mt-2 text-muted">{tab.blurb}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stations-home-title">
        <SectionHeader id="stations-home-title" title="Radio Stations" href="/radio" />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stations.slice(0, 3).map((station) => (
            <li key={station.slug}>
              <StationCard station={station} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
