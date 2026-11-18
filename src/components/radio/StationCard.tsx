import Link from "next/link";
import type { CSSProperties } from "react";
import { Thumb } from "@/components/Thumb";
import { hostNames, type Station } from "@/data/radio";

/** Station tile: art band in the station color, channel number, name, genre and hosts. */
export function StationCard({ station, channel }: { station: Station; channel: number }) {
  return (
    <article
      className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card bg-card"
      style={{ "--station": station.accent } as CSSProperties}
    >
      <div className="relative">
        <Thumb accent={station.accent} seed={station.slug} className="block aspect-[2.6/1] w-full" />
        <span className="absolute top-3 left-3 rounded-[4px] border border-white/15 bg-bg/70 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-fg uppercase backdrop-blur-sm">
          CH {String(channel).padStart(2, "0")}
        </span>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ backgroundColor: station.accent }} />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-4 md:p-5">
        <div>
          <h3 className="display text-[30px] leading-none">
            <Link href={`/radio/${station.slug}`} className="card-link">
              {station.name}
            </Link>
          </h3>
          <p className="mt-1.5 text-[14px] text-muted">{station.genre}</p>
        </div>
        <p className="font-mono text-[11px] tracking-[0.08em] uppercase" style={{ color: station.accent }}>
          <span className="sr-only">Hosts: </span>
          {hostNames(station)}
        </p>
      </div>
    </article>
  );
}
