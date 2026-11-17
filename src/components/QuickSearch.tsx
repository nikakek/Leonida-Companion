"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { StatusBadge } from "@/components/StatusBadge";
import { cheats } from "@/data/cheats";
import { stations, trackAnchor } from "@/data/radio";
import { matchesQuery } from "@/lib/search";

const RESULTS_ID = "quick-search-results";
const MAX_PER_GROUP = 5;

const songs = stations.flatMap((station) => station.tracks.map((track) => ({ station, track })));

/** Home quick search across cheats and songs. */
export function QuickSearch() {
  const [query, setQuery] = useState("");
  const active = query.trim().length > 0;

  const { cheatHits, songHits } = useMemo(() => {
    if (!active) return { cheatHits: [], songHits: [] };
    return {
      cheatHits: cheats
        .filter((cheat) => matchesQuery([cheat.title, cheat.category, cheat.description], query))
        .slice(0, MAX_PER_GROUP),
      songHits: songs
        .filter(({ station, track }) => matchesQuery([track.title, track.artist, station.name], query))
        .slice(0, MAX_PER_GROUP),
    };
  }, [active, query]);

  const empty = active && cheatHits.length === 0 && songHits.length === 0;

  return (
    <div className="w-full max-w-xl">
      <SearchInput
        value={query}
        onChange={setQuery}
        label="Search cheats and songs"
        placeholder="Search cheats and songs"
        controls={RESULTS_ID}
      />
      <div id={RESULTS_ID} aria-live="polite">
        {active ? (
          <div className="mt-2 rounded-card bg-card p-2">
            {empty ? (
              <p className="px-3 py-3 text-muted">No matches yet. Try a song, artist or cheat name.</p>
            ) : (
              <>
                {cheatHits.length > 0 ? (
                  <ResultGroup title="Cheats">
                    {cheatHits.map((cheat) => (
                      <li key={cheat.id}>
                        <Link
                          href={`/cheats/${cheat.slug}`}
                          className="flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-card-hover"
                        >
                          <span className="font-medium">{cheat.title}</span>
                          <StatusBadge status={cheat.status} />
                        </Link>
                      </li>
                    ))}
                  </ResultGroup>
                ) : null}
                {songHits.length > 0 ? (
                  <ResultGroup title="Songs">
                    {songHits.map(({ station, track }) => (
                      <li key={`${station.slug}-${track.artist}-${track.title}`}>
                        <Link
                          href={`/radio/${station.slug}#${trackAnchor(track)}`}
                          className="flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-card-hover"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{track.title}</span>
                            <span className="block truncate text-[15px] text-muted">
                              {track.artist} · {station.name}
                            </span>
                          </span>
                          {track.status !== "confirmed" ? <StatusBadge status={track.status} /> : null}
                        </Link>
                      </li>
                    ))}
                  </ResultGroup>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <p className="px-3 pt-1 pb-1 text-[13px] font-medium text-muted">{title}</p>
      <ul>{children}</ul>
    </div>
  );
}
