import type { MetadataRoute } from "next";
import { cheats } from "@/data/cheats";
import { stations } from "@/data/radio";
import { absoluteUrl } from "@/lib/seo";

const SITE_UPDATED = "2026-11-17";

/** Static routes plus CONFIRMED dynamic routes only. Unconfirmed cheats are noindex and excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/cheats", priority: 0.9, changeFrequency: "daily" },
    { path: "/radio", priority: 0.9, changeFrequency: "daily" },
    { path: "/map", priority: 0.7, changeFrequency: "daily" },
    { path: "/deals", priority: 0.5, changeFrequency: "weekly" },
    { path: "/about", priority: 0.3, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "monthly" },
    { path: "/affiliate-disclosure", priority: 0.2, changeFrequency: "monthly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: SITE_UPDATED,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...stations
      .filter((station) => station.status === "confirmed")
      .map((station) => ({
        url: absoluteUrl(`/radio/${station.slug}`),
        lastModified: station.lastVerified,
        changeFrequency: "daily" as const,
        priority: 0.8,
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
