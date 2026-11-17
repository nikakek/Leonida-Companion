import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Leonida Companion: your pocket guide to Leonida";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Unofficial Companion",
    title: "Your Pocket Guide to Leonida",
    highlight: "Leonida",
    subtitle: "Cheats, radio song finder, map and deals. Every entry labeled by verification status.",
  });
}
