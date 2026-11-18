import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Allow all crawlers (AI crawlers included) everywhere except the API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
