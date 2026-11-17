import { ExternalIcon } from "@/components/Icons";
import { StatusBadge } from "@/components/StatusBadge";
import { spotifySearchUrl, trackAnchor, youtubeSearchUrl, type Track } from "@/data/radio";

interface TrackRowProps {
  track: Track;
  /** Shown in search results so users see where the song plays. */
  station?: { name: string; accent: string };
  withAnchor?: boolean;
}

export function TrackRow({ track, station, withAnchor = false }: TrackRowProps) {
  const name = `${track.artist}, "${track.title}"`;
  return (
    <div
      id={withAnchor ? trackAnchor(track) : undefined}
      className="flex scroll-mt-24 flex-col gap-3 rounded-2xl bg-card p-4 md:flex-row md:items-center md:justify-between md:px-6"
    >
      <div className="min-w-0">
        <p className="font-medium text-fg">{track.title}</p>
        <p className="text-muted">{track.artist}</p>
        {station || track.status !== "confirmed" ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {station ? (
              <span className="inline-flex items-center gap-2 text-[15px]">
                <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: station.accent }} />
                <span className="text-muted">Plays on</span>
                <span className="font-medium">{station.name}</span>
              </span>
            ) : null}
            {track.status !== "confirmed" ? <StatusBadge status={track.status} /> : null}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 gap-2">
        <a
          href={spotifySearchUrl(track)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${name} on Spotify (opens in a new tab)`}
          className="btn-secondary btn-sm"
        >
          Spotify
          <ExternalIcon />
        </a>
        <a
          href={youtubeSearchUrl(track)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${name} on YouTube (opens in a new tab)`}
          className="btn-secondary btn-sm"
        >
          YouTube
          <ExternalIcon />
        </a>
      </div>
    </div>
  );
}
