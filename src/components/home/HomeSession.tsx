"use client";

import Link from "next/link";
import { useMemo } from "react";
import { StarIcon } from "@/components/Icons";
import { SubmitTrigger } from "@/components/submit/SubmitTrigger";
import { cheats } from "@/data/cheats";
import { pins } from "@/data/pins";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSubmissions } from "@/hooks/useSubmissions";
import { STORAGE_KEYS } from "@/lib/events";

const none: string[] = [];

/**
 * "Your session": favorites, map progress and submissions from this device.
 * Server render shows the empty state; blocks have fixed minimum heights so stored values do not shift layout.
 */
export function HomeSession() {
  const [favoriteIds] = useLocalStorage<string[]>(STORAGE_KEYS.favoriteCheats, none);
  const [foundIds] = useLocalStorage<string[]>(STORAGE_KEYS.foundPins, none);
  const { submissions } = useSubmissions();

  const favorites = useMemo(() => {
    const ids = new Set(Array.isArray(favoriteIds) ? favoriteIds : []);
    return cheats.filter((cheat) => ids.has(cheat.id));
  }, [favoriteIds]);

  const found = useMemo(() => {
    const ids = new Set(Array.isArray(foundIds) ? foundIds : []);
    return pins.filter((pin) => ids.has(pin.id)).length;
  }, [foundIds]);
  const percent = pins.length ? Math.round((found / pins.length) * 100) : 0;

  return (
    <div className="grid overflow-hidden rounded-card border border-line bg-card md:grid-cols-3">
      <section aria-labelledby="session-favorites" className="flex min-h-44 flex-col gap-3 border-b border-line p-4 md:border-r md:border-b-0 md:p-5">
        <div className="flex items-center justify-between">
          <h3 id="session-favorites" className="eyebrow text-muted">
            Starred Cheats
          </h3>
          <span className="font-mono text-[12px] text-faint">{favorites.length}</span>
        </div>
        {favorites.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {favorites.slice(0, 3).map((cheat) => (
              <li key={cheat.id}>
                <Link href={`/cheats/${cheat.slug}`} className="flex min-h-9 items-center gap-2 text-[15px] hover:text-accent">
                  <StarIcon filled size={16} className="shrink-0 text-accent" />
                  <span className="truncate">{cheat.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-muted">Star a cheat and it will wait for you here.</p>
        )}
        <Link href="/cheats" className="mt-auto font-mono text-[12px] tracking-[0.1em] text-accent uppercase hover:text-accent-hover">
          {favorites.length > 3 ? `All ${favorites.length} starred →` : "Browse cheats →"}
        </Link>
      </section>

      <section aria-labelledby="session-map" className="flex min-h-44 flex-col gap-3 border-b border-line p-4 md:border-r md:border-b-0 md:p-5">
        <div className="flex items-center justify-between">
          <h3 id="session-map" className="eyebrow text-muted">
            Map Progress
          </h3>
          <span className="font-mono text-[12px] text-faint">{percent}%</span>
        </div>
        <p className="display text-[44px] leading-none">
          {found}
          <span className="text-faint"> / {pins.length}</span>
        </p>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="sr-only">
          {found} of {pins.length} pins found
        </p>
        <Link href="/map" className="mt-auto font-mono text-[12px] tracking-[0.1em] text-accent uppercase hover:text-accent-hover">
          Open map →
        </Link>
      </section>

      <section aria-labelledby="session-submissions" className="flex min-h-44 flex-col gap-3 p-4 md:p-5">
        <div className="flex items-center justify-between">
          <h3 id="session-submissions" className="eyebrow text-muted">
            Your Submissions
          </h3>
          <span className="font-mono text-[12px] text-faint">{submissions.length}</span>
        </div>
        <p className="text-[14px] text-muted">
          {submissions.length > 0
            ? `${submissions.length} pending review. Every find is checked by hand before it goes live.`
            : "Found a secret or a working cheat? Send it in for review."}
        </p>
        <SubmitTrigger className="btn-secondary btn-sm mt-auto self-start">Submit a Discovery</SubmitTrigger>
      </section>
    </div>
  );
}
