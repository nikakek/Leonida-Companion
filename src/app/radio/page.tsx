import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageIntro";
import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";
import { RadioSearch } from "@/components/radio/RadioSearch";
import { SampleNote } from "@/components/radio/SampleNote";
import { StationCard } from "@/components/radio/StationCard";
import { stations, trackAnchor } from "@/data/radio";
import { GAME_NAME, absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${GAME_NAME} Radio Stations: Song Finder and Hosts`,
  description:
    "Find which radio station plays a song in GTA 6. Stations, hosts and a preview sample of tracks, each marked by verification status.",
  path: "/radio",
  image: "/radio/opengraph-image",
});

const directoryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${GAME_NAME} radio stations`,
  numberOfItems: stations.length,
  itemListElement: stations.map((station, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: station.name,
    url: absoluteUrl(`/radio/${station.slug}`),
  })),
};

const songIndex = stations
  .flatMap((station) => station.tracks.map((track) => ({ station, track })))
  .sort((a, b) => a.track.title.localeCompare(b.track.title));

export default function RadioPage() {
  return (
    <>
      <JsonLd data={directoryJsonLd} />
      <PageIntro title="Radio">
        <p>Stations, hosts and a preview of what each one plays. Search for a song to see its station.</p>
        <div className="mt-4">
          <SampleNote />
        </div>
      </PageIntro>
      <RadioSearch />
      <section aria-labelledby="stations-title">
        <h2 id="stations-title" className="section-title mb-6 md:mb-8">
          Stations
        </h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((station) => (
            <li key={station.slug}>
              <StationCard station={station} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-muted">More stations are expected. This list will grow after launch.</p>
      </section>

      <section aria-labelledby="song-index-title" className="mt-16">
        <h2 id="song-index-title" className="section-title mb-2">
          Song Index
        </h2>
        <p className="mb-6 text-muted">Every song in the preview sample, A to Z, with the station that plays it.</p>
        <ul className="divide-y divide-line overflow-hidden rounded-card bg-card">
          {songIndex.map(({ station, track }) => (
            <li key={`${station.slug}-${track.artist}-${track.title}`}>
              <Link
                href={`/radio/${station.slug}#${trackAnchor(track)}`}
                className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 transition-colors duration-150 hover:bg-card-hover"
              >
                <span className="min-w-0 flex-1 basis-60">
                  <span className="font-medium">{track.title}</span>
                  <span className="text-muted"> by {track.artist}</span>
                </span>
                <span className="flex items-center gap-2 text-[15px]">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: station.accent }} />
                  {station.name}
                </span>
                {track.status !== "confirmed" ? <StatusBadge status={track.status} /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <AdSlot id="radio-bottom" size="banner" />
    </>
  );
}
