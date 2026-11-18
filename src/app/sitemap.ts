import type { MetadataRoute } from "next";
import { LEGAL_UPDATED } from "@/components/LegalPage";
import { hasAnyDeal } from "@/config/monetization";
import { cheats } from "@/data/cheats";
import { news } from "@/data/news";
import { pins } from "@/data/pins";
import { releaseFacts } from "@/data/release";
import { stations } from "@/data/radio";
import { absoluteUrl } from "@/lib/seo";
import { latestVerified } from "@/lib/verification";

type Frequency = "daily" | "weekly" | "monthly";

/**
 * Hub pages, legal pages, every station and news page, plus CONFIRMED cheat pages only.
 * Unconfirmed cheat pages are noindex and stay out. `lastModified` follows the data files.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const cheatsUpdated = latestVerified(cheats);
  const radioUpdated = latestVerified([...stations, ...stations.flatMap((station) => station.tracks)]);
  const mapUpdated = latestVerified(pins);
  const newsUpdated = latestVerified(news);
  const siteUpdated = [cheatsUpdated, radioUpdated, mapUpdated, newsUpdated].sort().at(-1) ?? LEGAL_UPDATED;

  const staticRoutes: { path: string; priority: number; changeFrequency: Frequency; lastModified: string }[] = [
    { path: "/", priority: 1, changeFrequency: "daily", lastModified: siteUpdated },
    { path: "/cheats", priority: 0.9, changeFrequency: "daily", lastModified: cheatsUpdated },
    { path: "/radio", priority: 0.9, changeFrequency: "daily", lastModified: radioUpdated },
    { path: "/map", priority: 0.8, changeFrequency: "daily", lastModified: mapUpdated },
    { path: "/release-date", priority: 0.8, changeFrequency: "daily", lastModified: latestVerified(releaseFacts) },
    { path: "/news", priority: 0.8, changeFrequency: "daily", lastModified: newsUpdated },
    ...(hasAnyDeal ? [{ path: "/deals", priority: 0.4, changeFrequency: "weekly" as const, lastModified: LEGAL_UPDATED }] : []),
    { path: "/about", priority: 0.3, changeFrequency: "monthly", lastModified: LEGAL_UPDATED },
    { path: "/privacy", priority: 0.2, changeFrequency: "monthly", lastModified: LEGAL_UPDATED },
    { path: "/affiliate-disclosure", priority: 0.2, changeFrequency: "monthly", lastModified: LEGAL_UPDATED },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...stations.map((station) => ({
      url: absoluteUrl(`/radio/${station.slug}`),
      lastModified: latestVerified([station, ...station.tracks]),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...news.map((item) => ({
      url: absoluteUrl(`/news/${item.slug}`),
      lastModified: item.lastVerified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...cheats
      .filter((cheat) => cheat.status === "confirmed")
      .map((cheat) => ({
        url: absoluteUrl(`/cheats/${cheat.slug}`),
        lastModified: cheat.lastVerified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  ];
}
