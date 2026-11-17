import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Name used when describing the game in copy (nominative use only; never the site name). */
export const GAME_NAME = "GTA 6";

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  /** Route of the opengraph-image for this page (defaults to the site-wide image). */
  image?: string;
}

/**
 * Share images are listed explicitly because a page's `openGraph` object replaces the inherited one.
 * Pass the route of the segment's own opengraph-image file when it has one.
 */
const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Full per-page metadata: title, description, canonical, OpenGraph and Twitter card. */
export function pageMetadata({ title, description, path, noindex = false, image = DEFAULT_OG_IMAGE }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
      title,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}
