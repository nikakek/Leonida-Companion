import { cheats, getCheat } from "@/data/cheats";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Cheat details";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamicParams = false;

export function generateStaticParams() {
  return cheats.map((cheat) => ({ slug: cheat.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const cheat = getCheat(params.slug);
  return renderOgImage({
    eyebrow: cheat ? `${cheat.category} Cheat` : "Cheat",
    title: cheat?.title ?? "Cheat",
    subtitle: cheat?.status === "confirmed" ? "Button combo for PS5 and Xbox Series X|S." : "Combo not verified yet.",
    status: cheat?.status,
  });
}
