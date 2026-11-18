import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageIntro";
import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { RadioSearch } from "@/components/radio/RadioSearch";
import { SampleNote } from "@/components/radio/SampleNote";
import { StationCard } from "@/components/radio/StationCard";
import { stations, trackAnchor } from "@/data/radio";
import { VerificationNote } from "@/components/VerificationNote";
import { GAME_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { latestVerified } from "@/lib/verification";

export const metadata: Metadata = pageMetadata({
  title: `${GAME_NAME} Radio Stations: Song Finder and Hosts`,
  description: `Find which ${GAME_NAME} radio station plays a song. Stations, genres, hosts and a preview sample of tracks, each marked by verification status.`,
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

const allTracks = songIndex.map((item) => item.track);
const confirmedTracks = allTracks.filter((track) => track.status === "confirmed").length;
const updated = latestVerified([...stations, ...allTracks]);
const genreList = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
  stations.map((station) => `${station.name} (${station.genre.split(":")[0].toLowerCase()})`),
);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Radio", href: "/radio" },
];

export default function RadioPage() {
  return (
    <>
      <JsonLd data={directoryJsonLd} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageIntro title="Radio" eyebrow={`${stations.length} stations · ${songIndex.length} tracks`}>
        <p>Search a song, artist or host to see which station plays it. Each station lists its hosts and a preview of its tracks.</p>
        <div className="mt-4">
          <SampleNote />
        </div>
      </PageIntro>
      <VerificationNote updated={updated} allConfirmed={false}>
        Full playlists are not listed. {confirmedTracks} of the {allTracks.length} preview songs are confirmed; the rest are
        marked Testing at Launch. More stations and songs are added as they are checked in-game.
      </VerificationNote>
      <RadioSearch />
      <section aria-labelledby="stations-title">
        <SectionHeader id="stations-title" eyebrow="Tune in" title="Stations" />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
          {stations.map((station, index) => (
            <li key={station.slug} className="min-w-0">
              <StationCard station={station} channel={index + 1} />
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-[15px] text-muted">
          {GAME_NAME} radio stations listed so far: {genreList}. Open a station to see its hosts and the songs known
          to play on it. More stations are expected, and this list grows after launch.
        </p>
      </section>

      <section aria-labelledby="song-index-title" className="mt-14 scroll-mt-24">
        <SectionHeader id="song-index-title" eyebrow="A to Z" title="Song Index" />
        <p className="-mt-2 mb-5 text-[15px] text-muted">Every song in the preview sample, with the station that plays it.</p>
        <ul className="overflow-hidden rounded-card border border-line bg-card">
          {songIndex.map(({ station, track }) => (
            <li key={`${station.slug}-${track.artist}-${track.title}`} className="border-b border-line last:border-b-0">
              <Link
                href={`/radio/${station.slug}#${trackAnchor(track)}`}
                className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 transition-colors duration-150 hover:bg-card-hover"
              >
                <span aria-hidden="true" className="h-7 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: station.accent }} />
                <span className="min-w-0 flex-1 basis-52">
                  <span className="font-semibold">{track.title}</span>
                  <span className="text-muted"> · {track.artist}</span>
                </span>
                <span className="flex items-center gap-2">
                  {track.status !== "confirmed" ? <StatusBadge status={track.status} /> : null}
                  <span className="font-mono text-[11px] tracking-[0.08em] uppercase" style={{ color: station.accent }}>
                    {station.name}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <AdSlot id="radio-bottom" size="banner" />
    </>
  );
}
