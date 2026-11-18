"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
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
import { STORAGE_KEYS } from "@/lib/events";
import { matchesQuery } from "@/lib/search";

const RESULTS_ID = "cheat-results";
const noFavorites: string[] = [];

function CheatCombo({ cheat, platform }: { cheat: Cheat; platform: Platform }) {
  if (!hasVerifiedCombo(cheat, platform)) {
    return (
      <p className="flex items-center gap-2 font-mono text-[12px] text-faint">
        <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
        Combo not verified yet
      </p>
    );
  }
  return platform === "ps5" ? (
    <ComboBadges platform="ps5" buttons={cheat.inputs.ps5} />
  ) : (
    <ComboBadges platform="xbox" buttons={cheat.inputs.xbox} />
  );
}

interface CheatRowProps {
  cheat: Cheat;
  platform: Platform;
  starred: boolean;
  onToggle: () => void;
}

/** Dense, scannable cheat entry: category stripe, title, combo line, quiet status, star. */
function CheatRow({ cheat, platform, starred, onToggle }: CheatRowProps) {
  const accent = categoryAccents[cheat.category];
  return (
    <article
      className={`stripe-row relative flex items-start gap-3 py-3.5 pr-2.5 pl-4 transition-colors duration-150 hover:border-line-strong hover:bg-card-hover has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-accent ${
        starred ? "border-accent/35 bg-[linear-gradient(90deg,rgba(255,77,157,0.08),transparent_60%)]" : ""
      }`}
      style={{ "--stripe": starred ? "#FF4D9D" : accent } as CSSProperties}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: accent }}>
            {cheat.category}
          </span>
          <StatusBadge status={cheat.status} />
        </div>
        <h3 className="card-title">
          <Link href={`/cheats/${cheat.slug}`} className="card-link focus-visible:outline-none">
            {cheat.title}
          </Link>
        </h3>
        <CheatCombo cheat={cheat} platform={platform} />
      </div>
      <div className="relative z-10">
        <FavoriteButton title={cheat.title} active={starred} onToggle={onToggle} />
      </div>
    </article>
  );
}

export function CheatsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CheatCategory | "All">("All");
  const [platform] = usePlatform();
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEYS.favoriteCheats, noFavorites);

  const favoriteSet = useMemo(() => new Set(Array.isArray(favorites) ? favorites : []), [favorites]);

  const results = useMemo(
    () =>
      cheats.filter(
        (cheat) =>
          (category === "All" || cheat.category === category) &&
          matchesQuery([cheat.title, cheat.description, cheat.category], query),
      ),
    [query, category],
  );
  const starred = results.filter((cheat) => favoriteSet.has(cheat.id));
  const rest = results.filter((cheat) => !favoriteSet.has(cheat.id));

  const toggleFavorite = (id: string) =>
    setFavorites((previous) => {
      const list = Array.isArray(previous) ? previous : [];
      return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    });

  const renderList = (items: Cheat[]) => (
    <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((cheat) => (
        <li key={cheat.id} className="min-w-0">
          <CheatRow
            cheat={cheat}
            platform={platform}
            starred={favoriteSet.has(cheat.id)}
            onToggle={() => toggleFavorite(cheat.id)}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="cheat-list-title">
      <h2 id="cheat-list-title" className="sr-only">
        Cheat list
      </h2>
      <div className="flex flex-col gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="Search cheats"
          placeholder="Search cheats, e.g. wanted level"
          controls={RESULTS_ID}
          shortcut
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by category">
          {(["All", ...cheatCategories] as const).map((item) => (
            <button
              key={item}
              type="button"
              className="chip"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item !== "All" ? (
                <span aria-hidden="true" className="size-1.5 rounded-full" style={{ backgroundColor: categoryAccents[item] }} />
              ) : null}
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? "cheat" : "cheats"} shown
      </p>

      <div id={RESULTS_ID} className="mt-6 flex flex-col gap-6">
        {results.length === 0 ? (
          <EmptyState
            message="No matches. Know a code? Submit it."
            action={<SubmitTrigger className="btn-primary">Submit a Code</SubmitTrigger>}
          />
        ) : (
          <>
            {starred.length > 0 ? (
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2">
                  <span aria-hidden="true">★</span> Starred · {starred.length}
                </p>
                {renderList(starred)}
              </div>
            ) : null}
            <div>
              <p className="eyebrow mb-3 text-faint">
                {starred.length > 0 ? "All others" : category === "All" ? "All cheats" : category} · {rest.length}
              </p>
              {rest.length > 0 ? renderList(rest) : <p className="text-[14px] text-muted">Everything here is starred.</p>}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
