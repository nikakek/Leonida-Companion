import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { StatusBadge } from "@/components/StatusBadge";
import { Thumb } from "@/components/Thumb";
import { SampleNote } from "@/components/radio/SampleNote";
import { TrackRow } from "@/components/radio/TrackRow";
import { getStation, stations, type Station, type Track } from "@/data/radio";
import { formatDate } from "@/lib/format";
import { GAME_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

export function generateStaticParams() {
  return stations.map((station) => ({ station: station.slug }));
}

type Props = { params: Promise<{ station: string }> };

const confirmedTracks = (station: Station) => station.tracks.filter((track) => track.status === "confirmed");
const songLabel = (track: Track) => `"${track.title}" by ${track.artist}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station: slug } = await params;
  const station = getStation(slug);
  if (!station) return {};
  const confirmed = confirmedTracks(station);
  const songs = confirmed.length > 0 ? ` Confirmed songs include ${listFormat.format(confirmed.map(songLabel))}.` : "";
  return pageMetadata({
    title: `${station.name} Songs in ${GAME_NAME}: Hosts and Tracklist Preview`,
    description: `${station.name} (${station.genre}) hosted by ${listFormat.format(station.hosts.map((h) => h.persona))}.${songs} Preview sample, not the full playlist.`,
    path: `/radio/${station.slug}`,
    image: `/radio/${station.slug}/opengraph-image`,
  });
}

interface Faq {
  question: string;
  answer: string;
}

/** FAQ entries built only from verified data. Stations with no confirmed songs get no song answer. */
function buildFaqs(station: Station): Faq[] {
  const confirmed = confirmedTracks(station);
  if (confirmed.length === 0) return [];
  return [
    {
      question: `Which songs are on ${station.name} in ${GAME_NAME}?`,
      answer: `Confirmed songs on ${station.name} include ${listFormat.format(confirmed.map(songLabel))}. This is a preview sample, not the full playlist.`,
    },
    {
      question: `Is this the full ${station.name} playlist?`,
      answer: `No. This page lists a preview sample of ${station.name}. The full playlist is not listed yet and will be added after it is verified.`,
    },
  ];
}

export default async function StationPage({ params }: Props) {
  const { station: slug } = await params;
  const station = getStation(slug);
  if (!station) notFound();

  // Related: the next stations in list order, wrapping around, so every station gets linked.
  const index = stations.indexOf(station);
  const others = Array.from({ length: Math.min(3, stations.length - 1) }, (_, k) => stations[(index + k + 1) % stations.length]);
  const confirmed = confirmedTracks(station);
  const faqs = buildFaqs(station);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Radio", href: "/radio" },
    { name: station.name, href: `/radio/${station.slug}` },
  ];
  const hostList = listFormat.format(station.hosts.map((host) => host.persona));

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {confirmed.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "MusicPlaylist",
            name: `${station.name} (preview sample)`,
            description: `Confirmed preview sample of songs on ${station.name} in ${GAME_NAME}. Not the full playlist.`,
            url: absoluteUrl(`/radio/${station.slug}`),
            numTracks: confirmed.length,
            track: confirmed.map((track) => ({
              "@type": "MusicRecording",
              name: track.title,
              byArtist: { "@type": "MusicGroup", name: track.artist },
            })),
          }}
        />
      ) : null}
      {faqs.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }}
        />
      ) : null}

      <Breadcrumbs items={crumbs} />
      <header className="mb-10 grid gap-6 md:grid-cols-[1fr_340px] md:items-start">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={station.status} />
            <span className="flex items-center gap-2 text-muted">
              <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: station.accent }} />
              {station.genre}
            </span>
          </div>
          <h1 className="page-title">{station.name}</h1>
          <p className="mt-3 text-[17px] text-muted">
            {station.name} is a {GAME_NAME} radio station ({station.genre}) hosted by {hostList}. Below is a preview sample of {station.tracks.length} songs
            it plays{confirmed.length < station.tracks.length ? `, ${confirmed.length} of them confirmed` : ""}.
          </p>
          <div className="mt-4">
            <SampleNote />
          </div>
        </div>
        <Thumb accent={station.accent} seed={station.slug} className="block aspect-video w-full rounded-card" />
      </header>

      <section aria-labelledby="tracks-title" className="mb-10">
        <h2 id="tracks-title" className="section-title mb-4">
          Songs on {station.name}
        </h2>
        <ul className="flex flex-col gap-2">
          {station.tracks.map((track) => (
            <li key={`${track.artist}-${track.title}`}>
              <TrackRow track={track} withAnchor />
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid gap-1 text-[15px] text-muted">
          <div className="flex gap-2">
            <dt>Last checked:</dt>
            <dd>{formatDate(station.lastVerified)}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Official source:</dt>
            <dd>
              {station.sourceUrl ? (
                <a href={station.sourceUrl} className="text-link" target="_blank" rel="noopener noreferrer">
                  Rockstar music page
                </a>
              ) : (
                "Not verified yet"
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="hosts-title" className="mb-10">
        <h2 id="hosts-title" className="section-title mb-4">
          Hosts
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {station.hosts.map((host) => (
            <li key={host.persona} className="rounded-2xl bg-card p-5">
              <p className="font-medium">{host.persona}</p>
              {host.voicedBy ? <p className="text-muted">Voiced by {host.voicedBy}</p> : null}
              {host.note ? <p className="mt-1 text-[15px] text-muted">{host.note}</p> : null}
            </li>
          ))}
        </ul>
        {station.hostsNote ? <p className="mt-3 text-[15px] text-muted">{station.hostsNote}</p> : null}
      </section>

      <section aria-labelledby="faq-title" className="mb-10">
        <h2 id="faq-title" className="section-title mb-4">
          Questions
        </h2>
        {faqs.length > 0 ? (
          <dl className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-card p-5">
                <dt className="font-medium">{faq.question}</dt>
                <dd className="mt-1 text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="rounded-2xl bg-card p-5 text-muted">
            No songs on {station.name} are verified yet. The tracks above are marked Testing at Launch until they are
            confirmed.
          </p>
        )}
      </section>

      <section aria-labelledby="more-stations-title">
        <h2 id="more-stations-title" className="section-title mb-4">
          More Stations
        </h2>
        <ul className="flex flex-col gap-2">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/radio/${item.slug}`}
                className="flex min-h-14 items-center gap-3 rounded-2xl bg-card px-5 transition-colors duration-150 hover:bg-card-hover"
              >
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.accent }} />
                <span className="shrink-0 font-medium">{item.name}</span>
                <span className="ml-auto min-w-0 truncate text-[15px] text-muted">{item.genre}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
