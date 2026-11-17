"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { ComboBadges } from "@/components/ControllerBadge";
import { EmptyState } from "@/components/EmptyState";
import { SearchInput } from "@/components/SearchInput";
import { StatusBadge } from "@/components/StatusBadge";
import { FavoriteButton } from "@/components/cheats/FavoriteButton";
import { SubmitTrigger } from "@/components/submit/SubmitTrigger";
import {
  categoryAccents,
  cheatCategories,
  cheats,
  hasVerifiedCombo,
  type Cheat,
  type CheatCategory,
  type Platform,
} from "@/data/cheats";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePlatform } from "@/hooks/usePlatform";
import { matchesQuery } from "@/lib/search";

const FAVORITES_KEY = "leonida:favorite-cheats";
const RESULTS_ID = "cheat-results";
const noFavorites: string[] = [];

function CheatCombo({ cheat, platform }: { cheat: Cheat; platform: Platform }) {
  if (!hasVerifiedCombo(cheat, platform)) {
    return <p className="mt-3 font-mono text-[14px] text-muted">Combo not verified yet</p>;
  }
  return (
    <div className="mt-4">
      {platform === "ps5" ? (
        <ComboBadges platform="ps5" buttons={cheat.inputs.ps5} />
      ) : (
        <ComboBadges platform="xbox" buttons={cheat.inputs.xbox} />
      )}
    </div>
  );
}

export function CheatsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CheatCategory | "All">("All");
  const [platform] = usePlatform();
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, noFavorites);

  const favoriteSet = useMemo(() => new Set(Array.isArray(favorites) ? favorites : []), [favorites]);

  const results = useMemo(() => {
    const filtered = cheats.filter(
      (cheat) =>
        (category === "All" || cheat.category === category) &&
        matchesQuery([cheat.title, cheat.description, cheat.category], query),
    );
    // Stable sort: favorites first, original order otherwise.
    return [...filtered].sort((a, b) => Number(favoriteSet.has(b.id)) - Number(favoriteSet.has(a.id)));
  }, [query, category, favoriteSet]);

  const toggleFavorite = (id: string) =>
    setFavorites((previous) => {
      const list = Array.isArray(previous) ? previous : [];
      return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    });

  return (
    <section aria-labelledby="cheat-list-title">
      <h2 id="cheat-list-title" className="sr-only">
        Cheat list
      </h2>
      <div className="flex flex-col gap-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="Search cheats"
          placeholder="Search cheats, e.g. wanted level"
          controls={RESULTS_ID}
        />
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by category">
          {(["All", ...cheatCategories] as const).map((item) => (
            <button
              key={item}
              type="button"
              className="chip"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? "cheat" : "cheats"} shown
      </p>

      <div id={RESULTS_ID} className="mt-8">
        {results.length === 0 ? (
          <EmptyState
            message="No matches. Know a code? Submit it."
            action={<SubmitTrigger className="btn-primary">Submit a Code</SubmitTrigger>}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((cheat) => (
              <li key={cheat.id}>
                <Card
                  href={`/cheats/${cheat.slug}`}
                  title={cheat.title}
                  accent={categoryAccents[cheat.category]}
                  seed={cheat.slug}
                  actions={
                    <FavoriteButton
                      title={cheat.title}
                      active={favoriteSet.has(cheat.id)}
                      onToggle={() => toggleFavorite(cheat.id)}
                    />
                  }
                  meta={
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span>{cheat.category}</span>
                      <StatusBadge status={cheat.status} />
                    </span>
                  }
                >
                  <CheatCombo cheat={cheat} platform={platform} />
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
