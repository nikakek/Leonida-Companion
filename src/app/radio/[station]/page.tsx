import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatusBadge } from "@/components/StatusBadge";
import { Thumb } from "@/components/Thumb";
import { SampleNote } from "@/components/radio/SampleNote";
import { TrackRow } from "@/components/radio/TrackRow";
import { getStation, stations } from "@/data/radio";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

export function generateStaticParams() {
  return stations.map((station) => ({ station: station.slug }));
}

type Props = { params: Promise<{ station: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station: slug } = await params;
  const station = getStation(slug);
  if (!station) return {};
  return {
    title: `${station.name}: Songs and Hosts`,
    description: `${station.name} (${station.genre}). Hosts and a preview sample of songs, with verification status for each track.`,
    alternates: { canonical: `/radio/${station.slug}` },
  };
}

export default async function StationPage({ params }: Props) {
  const { station: slug } = await params;
  const station = getStation(slug);
  if (!station) notFound();

  const others = stations.filter((item) => item.slug !== station.slug).slice(0, 3);

  return (
    <article>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Radio", href: "/radio" },
          { name: station.name, href: `/radio/${station.slug}` },
        ]}
      />
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
            {station.name} is hosted by {listFormat.format(station.hosts.map((host) => host.persona))}. Below is a
            preview sample of {station.tracks.length} songs it plays.
          </p>
          <div className="mt-4">
            <SampleNote />
          </div>
        </div>
        <Thumb accent={station.accent} seed={station.slug} className="block aspect-video w-full rounded-card" />
      </header>

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
                <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: item.accent }} />
                <span className="font-medium">{item.name}</span>
                <span className="ml-auto truncate text-[15px] text-muted">{item.genre}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
