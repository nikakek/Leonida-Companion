import type { CSSProperties } from "react";
import { ExternalIcon } from "@/components/Icons";
import { StatusBadge } from "@/components/StatusBadge";
import { spotifySearchUrl, trackAnchor, youtubeSearchUrl, type Track } from "@/data/radio";

interface TrackRowProps {
  track: Track;
  /** Shown in search results so users see where the song plays. */
  station?: { name: string; accent: string };
  /** Stripe color when no station is shown (station pages). */
  accent?: string;
  withAnchor?: boolean;
  index?: number;
}

const linkClass =
  "inline-flex h-9 items-center gap-1.5 rounded-[5px] border border-line px-2.5 font-mono text-[11px] tracking-[0.08em] text-muted uppercase transition-colors duration-150 hover:border-line-strong hover:text-fg";

export function TrackRow({ track, station, accent, withAnchor = false, index }: TrackRowProps) {
  const name = `${track.artist}, "${track.title}"`;
  return (
    <div
      id={withAnchor ? trackAnchor(track) : undefined}
      className="stripe-row flex scroll-mt-24 flex-col gap-3 py-3 pr-3 pl-4 target:border-accent/60 sm:flex-row sm:items-center"
      style={{ "--stripe": station?.accent ?? accent } as CSSProperties}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {index !== undefined ? (
          <span className="w-6 shrink-0 pt-0.5 font-mono text-[12px] text-faint tabular-nums">{String(index).padStart(2, "0")}</span>
        ) : null}
        <div className="min-w-0">
          <p className="font-semibold text-fg">{track.title}</p>
          <p className="text-[14px] text-muted">{track.artist}</p>
          {station || track.status !== "confirmed" ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {station ? (
                <span className="font-mono text-[11px] tracking-[0.08em] uppercase" style={{ color: station.accent }}>
                  <span className="text-faint">On </span>
                  {station.name}
                </span>
              ) : null}
              {track.status !== "confirmed" ? <StatusBadge status={track.status} /> : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className={`flex shrink-0 gap-1.5 ${index !== undefined ? "pl-9 sm:pl-0" : ""}`}>
        <a
          href={spotifySearchUrl(track)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${name} on Spotify (opens in a new tab)`}
          className={linkClass}
        >
          Spotify
          <ExternalIcon size={12} />
        </a>
        <a
          href={youtubeSearchUrl(track)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${name} on YouTube (opens in a new tab)`}
          className={linkClass}
        >
          YouTube
          <ExternalIcon size={12} />
        </a>
      </div>
    </div>
  );
}
