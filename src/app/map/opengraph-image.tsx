import { regions } from "@/config/regions";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Stylized map of Leonida with a progress tracker";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Map",
    title: "Track Every Secret in Leonida",
    highlight: "Leonida",
    subtitle: `${regions.length} regions, progress saved on your device. Pins are samples until verified.`,
    accent: "#FFB547",
  });
}
