"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { SearchInput } from "@/components/SearchInput";
import { StatusBadge } from "@/components/StatusBadge";
import { categoryAccents, cheats } from "@/data/cheats";
import { stations, trackAnchor } from "@/data/radio";
import { matchesQuery } from "@/lib/search";

const RESULTS_ID = "quick-search-results";
const MAX_PER_GROUP = 5;

const songs = stations.flatMap((station) => station.tracks.map((track) => ({ station, track })));

/** Home quick search across cheats and songs. `suggestions` are example queries taken from real data. */
export function QuickSearch({ suggestions = [] }: { suggestions?: readonly string[] }) {
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
    <div className="w-full">
      <SearchInput
        value={query}
        onChange={setQuery}
        label="Search cheats and songs"
        placeholder="Search cheats, songs, stations"
        controls={RESULTS_ID}
        size="lg"
        shortcut
      />
      {suggestions.length > 0 && !active ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.12em] text-faint uppercase">Try</span>
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="min-h-9 rounded-[4px] border border-line px-2.5 font-mono text-[12px] text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
      <div id={RESULTS_ID} aria-live="polite">
        {active ? (
          <div className="mt-2 overflow-hidden rounded-card border border-line-strong bg-card">
            {empty ? (
              <p className="px-4 py-4 text-muted">No matches yet. Try a song, artist, station or cheat name.</p>
            ) : (
              <>
                {cheatHits.length > 0 ? (
                  <ResultGroup title="Cheats" count={cheatHits.length}>
                    {cheatHits.map((cheat) => (
                      <li key={cheat.id}>
                        <Link
                          href={`/cheats/${cheat.slug}`}
                          className="flex min-h-12 items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-card-hover"
                        >
                          <span
                            aria-hidden="true"
                            className="h-6 w-[3px] shrink-0 rounded-full"
                            style={{ backgroundColor: categoryAccents[cheat.category] }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{cheat.title}</span>
                            <span className="block font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                              {cheat.category}
                            </span>
                          </span>
                          <StatusBadge status={cheat.status} />
                        </Link>
                      </li>
                    ))}
                  </ResultGroup>
                ) : null}
                {songHits.length > 0 ? (
                  <ResultGroup title="Songs" count={songHits.length}>
                    {songHits.map(({ station, track }) => (
                      <li key={`${station.slug}-${track.artist}-${track.title}`}>
                        <Link
                          href={`/radio/${station.slug}#${trackAnchor(track)}`}
                          className="flex min-h-12 items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-card-hover"
                        >
                          <span aria-hidden="true" className="h-6 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: station.accent }} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{track.title}</span>
                            <span className="block truncate text-[13px] text-muted">
                              {track.artist} <span className="text-faint">·</span> {station.name}
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

function ResultGroup({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <div className="border-b border-line py-1 last:border-b-0">
      <p className="flex justify-between px-4 pt-2 pb-1 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
        <span>{title}</span>
        <span>{count}</span>
      </p>
      <ul>{children}</ul>
    </div>
  );
}
