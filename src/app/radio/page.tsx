import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { RadioSearch } from "@/components/radio/RadioSearch";
import { SampleNote } from "@/components/radio/SampleNote";
import { StationCard } from "@/components/radio/StationCard";
import { stations } from "@/data/radio";

export const metadata: Metadata = {
  title: "Radio Stations and Song Finder",
  description:
    "Find which Leonida radio station plays a song. Stations, hosts and a preview sample of tracks, each marked by verification status.",
  alternates: { canonical: "/radio" },
};

export default function RadioPage() {
  return (
    <>
      <PageIntro title="Radio">
        <p>Stations, hosts and a preview of what each one plays. Search for a song to see its station.</p>
        <div className="mt-4">
          <SampleNote />
        </div>
      </PageIntro>
      <RadioSearch />
      <section aria-labelledby="stations-title">
        <h2 id="stations-title" className="section-title mb-6 md:mb-8">
          Stations
        </h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((station) => (
            <li key={station.slug}>
              <StationCard station={station} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-muted">More stations are expected. This list will grow after launch.</p>
      </section>
    </>
  );
}
