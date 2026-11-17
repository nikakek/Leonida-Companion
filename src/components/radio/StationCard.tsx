import { Card } from "@/components/Card";
import { hostNames, type Station } from "@/data/radio";

export function StationCard({ station }: { station: Station }) {
  return (
    <Card
      href={`/radio/${station.slug}`}
      title={station.name}
      accent={station.accent}
      seed={station.slug}
      meta={
        <span className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: station.accent }} />
            <span>{station.genre}</span>
          </span>
          <span>
            <span className="sr-only">Hosts: </span>
            {hostNames(station)}
          </span>
        </span>
      }
    />
  );
}
