"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { TrackRow } from "@/components/radio/TrackRow";
import { hostNames, stations } from "@/data/radio";
import { matchesQuery } from "@/lib/search";

const RESULTS_ID = "radio-results";

const trackIndex = stations.flatMap((station) =>
  station.tracks.map((track) => ({ station, track })),
);

/** "Find a song": searches songs, artists, hosts and stations. Station grid stays server-rendered below. */
export function RadioSearch() {
  const [query, setQuery] = useState("");
  const active = query.trim().length > 0;

  const { stationHits, trackHits } = useMemo(() => {
    if (!active) return { stationHits: [], trackHits: [] };
    return {
      stationHits: stations.filter((station) =>
        matchesQuery([station.name, station.genre, hostNames(station), ...station.hosts.map((h) => h.voicedBy ?? "")], query),
      ),
      trackHits: trackIndex.filter(({ station, track }) =>
        matchesQuery([track.title, track.artist, station.name], query),
      ),
    };
  }, [active, query]);

  return (
    <section aria-labelledby="find-song-title" className="mb-12">
      <h2 id="find-song-title" className="card-title mb-3">
        Find a Song
      </h2>
      <SearchInput
        value={query}
        onChange={setQuery}
        label="Search songs, artists, hosts or stations"
        placeholder="Song, artist, host or station"
        controls={RESULTS_ID}
      />
      <div id={RESULTS_ID} aria-live="polite" className="mt-4">
        {active ? (
          stationHits.length === 0 && trackHits.length === 0 ? (
            <p className="rounded-2xl bg-card p-5 text-muted">
              No matches in the preview sample. The full playlists are not listed yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {stationHits.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-[15px] font-medium text-muted">Stations</h3>
                  <ul className="flex flex-wrap gap-2">
                    {stationHits.map((station) => (
                      <li key={station.slug}>
                        <Link href={`/radio/${station.slug}`} className="chip gap-2">
                          <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: station.accent }} />
                          {station.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {trackHits.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-[15px] font-medium text-muted">Songs</h3>
                  <ul className="flex flex-col gap-2">
                    {trackHits.map(({ station, track }) => (
                      <li key={`${station.slug}-${track.artist}-${track.title}`}>
                        <TrackRow track={track} station={station} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
