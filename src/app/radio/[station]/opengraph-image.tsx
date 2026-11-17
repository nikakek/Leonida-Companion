import { getStation, hostNames, stations } from "@/data/radio";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Radio station songs and hosts";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamicParams = false;

export function generateStaticParams() {
  return stations.map((station) => ({ station: station.slug }));
}

export default function Image({ params }: { params: { station: string } }) {
  const station = getStation(params.station);
  return renderOgImage({
    eyebrow: "Radio Station",
    title: station?.name ?? "Radio Station",
    subtitle: station ? `${station.genre}. Hosted by ${hostNames(station)}.` : undefined,
    accent: station?.accent,
  });
}
