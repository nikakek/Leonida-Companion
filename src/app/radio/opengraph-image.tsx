import { stations } from "@/data/radio";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Radio stations and song finder";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Radio",
    title: "Which Station Plays That Song?",
    subtitle: `${stations.length} stations with hosts and a preview sample of tracks.`,
    accent: "#8A4DFF",
  });
}
