import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { StatusBadge } from "@/components/StatusBadge";
import { Thumb } from "@/components/Thumb";
import { VerificationNote } from "@/components/VerificationNote";
import { SampleNote } from "@/components/radio/SampleNote";
import { TrackRow } from "@/components/radio/TrackRow";
import { getStation, stations, type Station, type Track } from "@/data/radio";
import { formatDate } from "@/lib/format";
import { GAME_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { latestVerified } from "@/lib/verification";

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
      <header className="relative mb-10 overflow-hidden rounded-card border border-line bg-card">
        <Thumb accent={station.accent} seed={station.slug} className="absolute inset-0 h-full w-full opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,18,26,0.97)_0%,rgba(18,18,26,0.85)_55%,rgba(18,18,26,0.35)_100%)]" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ backgroundColor: station.accent }} />
        <div className="relative max-w-2xl p-5 md:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase" style={{ color: station.accent }}>
              CH {String(index + 1).padStart(2, "0")} · {station.genre}
            </span>
            <StatusBadge status={station.status} />
          </div>
          <h1 className="page-title">{station.name}</h1>
          <p className="mt-3 text-[16px] text-muted md:text-[17px]">
            {station.name} is a {GAME_NAME} radio station ({station.genre}) hosted by {hostList}. Below is a preview sample of {station.tracks.length} songs
            it plays{confirmed.length < station.tracks.length ? `, ${confirmed.length} of them confirmed` : ""}.
          </p>
          <div className="mt-4">
            <SampleNote />
          </div>
        </div>
      </header>

      <VerificationNote updated={latestVerified([station, ...station.tracks])} allConfirmed={false}>
        The full {station.name} playlist is not listed.{" "}
        {confirmed.length === station.tracks.length
          ? `The ${confirmed.length} songs below are confirmed`
          : `${confirmed.length} of the ${station.tracks.length} songs below are confirmed and the rest are marked Testing at Launch`}
        ; more are added as they are checked in-game.
      </VerificationNote>

      <section aria-labelledby="tracks-title" className="mb-10">
        <h2 id="tracks-title" className="section-title mb-4">
          Songs on {station.name}
        </h2>
        <ul className="flex flex-col gap-2">
          {station.tracks.map((track, trackIndex) => (
            <li key={`${track.artist}-${track.title}`}>
              <TrackRow track={track} accent={station.accent} index={trackIndex + 1} withAnchor />
            </li>
          ))}
        </ul>
        <dl className="meta mt-4 grid gap-1">
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
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {station.hosts.map((host) => (
            <li key={host.persona} className="panel flex items-start gap-3 p-4">
              <span
                aria-hidden="true"
                className="display flex size-10 shrink-0 items-center justify-center rounded-md border text-[20px]"
                style={{ borderColor: `${station.accent}66`, color: station.accent }}
              >
                {host.persona.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{host.persona}</span>
                {host.voicedBy ? <span className="block text-[14px] text-muted">Voiced by {host.voicedBy}</span> : null}
                {host.note ? <span className="mt-1 block font-mono text-[11px] text-faint">{host.note}</span> : null}
              </span>
            </li>
          ))}
        </ul>
        {station.hostsNote ? <p className="mt-3 text-[14px] text-muted">{station.hostsNote}</p> : null}
      </section>

      <section aria-labelledby="faq-title" className="mb-10">
        <h2 id="faq-title" className="section-title mb-4">
          Questions
        </h2>
        {faqs.length > 0 ? (
          <dl className="overflow-hidden rounded-card border border-line bg-card">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-line p-4 last:border-b-0 md:p-5">
                <dt className="font-semibold">{faq.question}</dt>
                <dd className="mt-1 text-[15px] text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="rounded-card border border-dashed border-line-strong p-5 text-muted">
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
                className="stripe-row flex min-h-14 items-center gap-3 px-4 pl-5"
                style={{ "--stripe": item.accent } as CSSProperties}
              >
                <span className="display shrink-0 text-[22px] leading-none">{item.name}</span>
                <span className="ml-auto min-w-0 truncate text-[15px] text-muted">{item.genre}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
