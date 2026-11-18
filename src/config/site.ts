const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const url = rawUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "Leonida Companion",
  shortName: "Leonida",
  description:
    "An unofficial, mobile-first GTA 6 companion for your Leonida playthrough: cheat lookups, radio station song finder, map and deals. Fan-made, with every entry marked by verification status.",
  url,
  domain: new URL(url).host,
  /** Public contact inbox from NEXT_PUBLIC_CONTACT_EMAIL. Undefined until set: pages then point to the submit form. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || undefined,
  launchDate: "2026-11-19",
  launchLabel: "Nov 19, 2026",
  disclaimer:
    "Unofficial fan site. Not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto and related marks belong to their owners.",
} as const;

export const navTabs = [
  { href: "/cheats", label: "Cheats", icon: "cheats" },
  { href: "/radio", label: "Radio", icon: "radio" },
  { href: "/map", label: "Map", icon: "map" },
  { href: "/deals", label: "Deals", icon: "deals" },
] as const;

export type NavIcon = (typeof navTabs)[number]["icon"];

export const secondaryLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
] as const;
