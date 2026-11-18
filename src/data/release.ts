// Update this file after launch; set status to confirmed only when verified in-game or from an official Rockstar source.

import type { Verifiable } from "@/lib/types";

export interface ReleaseFact extends Verifiable {
  id: string;
  label: string;
  /** Short answer. Unknown values say "Not verified yet" rather than guessing. */
  value: string;
  note?: string;
  /** Internal page with more detail (e.g. a news story). */
  href?: string;
}

const LAST_VERIFIED = "2026-11-18";
const NEWSWIRE = "https://www.rockstargames.com/newswire/article";
const DATE_POST = `${NEWSWIRE}/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026`;

/*
 * HOW TO UPDATE: change `value`, set status "confirmed" only with an official Rockstar source, update `lastVerified`.
 * Never add prices, unlock times or editions from retailer listings or press reports.
 */
export const releaseFacts: ReleaseFact[] = [
  {
    id: "date",
    label: "Release date",
    value: "Thursday, November 19, 2026",
    note: "Moved from the previous date of May 26, 2026.",
    href: "/news/release-date-november-19-2026",
    status: "confirmed",
    lastVerified: LAST_VERIFIED,
    sourceUrl: DATE_POST,
  },
  {
    id: "platforms",
    label: "Platforms",
    value: "PlayStation 5 and Xbox Series X|S",
    status: "confirmed",
    lastVerified: LAST_VERIFIED,
    sourceUrl: DATE_POST,
  },
  {
    id: "preload",
    label: "Pre-load",
    value: "Opened November 10, 2026",
    note: "Start times and download size are in the official post.",
    href: "/news/preload-begins-november-10",
    status: "confirmed",
    lastVerified: LAST_VERIFIED,
    sourceUrl: `${NEWSWIRE}/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10`,
  },
  {
    id: "unlock",
    label: "Unlock time",
    value: "Not verified yet",
    note: "May differ by platform and region. Check the official post for your console.",
    status: "testing",
    lastVerified: LAST_VERIFIED,
  },
  {
    id: "pc",
    label: "PC version",
    value: "Not announced",
    note: "Reports of a later PC release are unverified.",
    href: "/news/pc-version-not-announced",
    status: "testing",
    lastVerified: LAST_VERIFIED,
  },
  {
    id: "editions",
    label: "Editions",
    value: "Not verified yet",
    note: "Check the official store page for your console.",
    status: "testing",
    lastVerified: LAST_VERIFIED,
  },
  {
    id: "album",
    label: "Soundtrack album",
    value: "Grand Theft Auto VI: The Album, November 19",
    href: "/news/launch-week-official-posts",
    status: "confirmed",
    lastVerified: LAST_VERIFIED,
    sourceUrl: `${NEWSWIRE}/7599a881942544/announcing-grand-theft-auto-vi-the-album-coming-november-19`,
  },
];
