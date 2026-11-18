// Update this file after launch; set status to confirmed only when verified in-game or from an official Rockstar source.

import type { Verifiable } from "@/lib/types";

export const newsTags = ["Release", "Launch", "Platforms"] as const;
export type NewsTag = (typeof newsTags)[number];

export interface NewsSource {
  label: string;
  url: string;
}

export interface NewsItem extends Verifiable {
  slug: string;
  title: string;
  /** ISO date the news happened (official post or event date), shown on the page. */
  date: string;
  tag: NewsTag;
  /** One or two sentences: used on cards, as the lede and as the meta description. */
  summary: string;
  /** Original write-up, one string per paragraph. Facts only from the linked official sources. */
  body: string[];
  /** Extra official links beyond `sourceUrl` (e.g. several Newswire posts in a roundup). */
  sources?: NewsSource[];
}

/*
 * HOW TO ADD A STORY: copy an entry below, write it in your own words, and link the official post.
 *   - status "confirmed" only when every fact comes from Rockstar (Newswire, rockstargames.com/VI, official socials).
 *   - Reports, leaks and rumours are "testing" and must say so in the summary, or stay out entirely.
 *   - `date` is when it happened; `lastVerified` is the day you last checked the source.
 * Never paste text from Rockstar or other sites: summarize and link.
 */
const LAST_VERIFIED = "2026-11-18";

const NEWSWIRE = "https://www.rockstargames.com/newswire/article";

export const news: NewsItem[] = [
  {
    slug: "launch-week-official-posts",
    title: "Launch Week: The Official Posts Worth Reading Before November 19",
    date: "2026-11-18",
    tag: "Launch",
    summary:
      "A short guide to the Rockstar Newswire posts published in the run-up to launch: the launch trailer, the soundtrack album, the launch gallery and a collector's box.",
    body: [
      "With launch a day away, Rockstar's Newswire has collected several pre-release posts. This page does not repeat their details; it points you to each one so you can read the official wording yourself.",
      "The launch trailer is up on the Newswire. Rockstar has also announced Grand Theft Auto VI: The Album, a soundtrack release set for November 19, the same day as the game.",
      "There is a launch gallery on the official site, and Rockstar has opened pre-orders for a physical collector's item called The Goodtime State – Vice City Collection, offered while supplies last. Check the official listing for exactly what is in the box before ordering.",
      "We will cover launch-day news here once it is published by Rockstar.",
    ],
    sources: [
      { label: "Watch the Grand Theft Auto VI Launch Trailer", url: `${NEWSWIRE}/517572321a549a/watch-the-grand-theft-auto-vi-launch-trailer` },
      {
        label: "Announcing Grand Theft Auto VI: The Album, Coming November 19",
        url: `${NEWSWIRE}/7599a881942544/announcing-grand-theft-auto-vi-the-album-coming-november-19`,
      },
      { label: "Explore the Grand Theft Auto VI Launch Gallery", url: `${NEWSWIRE}/39ak81277255o9/explore-the-grand-theft-auto-vi-launch-gallery` },
      {
        label: "Pre-Order The Goodtime State – Vice City Collection",
        url: `${NEWSWIRE}/9k2a49ook82o57/pre-order-the-goodtime-state-vice-city-collection-now-while-supplies-l`,
      },
    ],
    status: "confirmed",
    lastVerified: LAST_VERIFIED,
    sourceUrl: "https://www.rockstargames.com/newswire",
  },
  {
    slug: "pc-version-not-announced",
    title: "Is GTA 6 Coming to PC? No Date Has Been Announced",
    date: "2026-11-18",
    tag: "Platforms",
    summary:
      "The announced platforms are PS5 and Xbox Series X|S. Rockstar has not announced a PC version or date; reports of a later PC release are unverified.",
    body: [
      "Rockstar has announced GTA 6 for PlayStation 5 and Xbox Series X|S. As of the date on this page, we have not found an official announcement of a PC version or a PC release date.",
      "Some outlets report that a PC version will follow later. Those reports do not come from Rockstar, so we treat them as unverified and do not repeat any dates here.",
      "This page will be updated and marked Confirmed only if Rockstar announces a PC release. Until then, the cheats and guides on this site cover PS5 and Xbox Series X|S only.",
    ],
    status: "testing",
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "preload-begins-november-10",
    title: "Pre-Load Opened on November 10",
    date: "2026-11-10",
    tag: "Launch",
    summary: "Rockstar confirmed that digital pre-loading began on November 10, ahead of the November 19 launch on PS5 and Xbox Series X|S.",
    body: [
      "Pre-loading lets you download the game before launch so it is ready to play when it unlocks. Rockstar's Newswire confirmed that pre-load began on November 10, nine days before launch.",
      "Start times and download size can differ by platform and region. We have not copied those figures here: the official post linked below has Rockstar's exact wording, and it is the version to trust.",
      "If you buy digitally, check your free storage against the size in the official post before launch day.",
    ],
    status: "confirmed",
    lastVerified: LAST_VERIFIED,
    sourceUrl: `${NEWSWIRE}/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10`,
  },
  {
    slug: "release-date-november-19-2026",
    title: "Release Date Moved to Thursday, November 19, 2026",
    date: "2025-11-06",
    tag: "Release",
    summary: "Rockstar moved GTA 6 from May 26, 2026 to Thursday, November 19, 2026, for PS5 and Xbox Series X|S.",
    body: [
      "Rockstar announced a new release date for GTA 6: Thursday, November 19, 2026. The game had previously been set for May 26, 2026.",
      "Rockstar said the extra months would go toward finishing the game to the standard players expect from the studio. The platforms did not change: PlayStation 5 and Xbox Series X|S.",
      "The countdown on this site's home page uses this date. We do not list an exact unlock time, since that can vary by platform and region.",
    ],
    status: "confirmed",
    lastVerified: LAST_VERIFIED,
    sourceUrl: `${NEWSWIRE}/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026`,
  },
];

/** Newest first. */
export const sortedNews: readonly NewsItem[] = [...news].sort((a, b) => b.date.localeCompare(a.date));

export function getNewsItem(slug: string): NewsItem | undefined {
  return news.find((item) => item.slug === slug);
}

/** Every official link for a story: `sourceUrl` first, then `sources`. */
export function newsSources(item: NewsItem): NewsSource[] {
  const primary = item.sourceUrl ? [{ label: "Rockstar Newswire", url: item.sourceUrl }] : [];
  return [...primary, ...(item.sources ?? [])];
}

/** Stripe/tag accent per news tag (decorative only). */
export const newsTagAccents: Record<NewsTag, string> = {
  Release: "#FF4D9D",
  Launch: "#FFB547",
  Platforms: "#3DE3F0",
};
