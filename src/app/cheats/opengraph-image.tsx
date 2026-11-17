import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Cheats for PS5 and Xbox Series X|S";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Cheats",
    title: "Cheat Lookup for PS5 and Xbox Series X|S",
    subtitle: "Combos appear only once verified in-game or by an official source.",
  });
}
