import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { MapExplorer } from "@/components/map/MapExplorer";
import { YourSubmissions } from "@/components/submit/YourSubmissions";
import { pins } from "@/data/pins";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Map of Leonida: Secrets and Progress Tracker",
  description:
    "A stylized map of Leonida with Easter eggs, collectibles, stunt jumps and safe houses. Track what you found on this device. Pins are samples until verified.",
  path: "/map",
});

export default function MapPage() {
  return (
    <>
      <PageIntro title="Map">
        <p>
          Tap a region to zoom in, tap a pin for details, and mark what you find. All {pins.length} pins are samples
          that show how the map works; real locations will be added once verified.
        </p>
      </PageIntro>
      <MapExplorer />
      <YourSubmissions />
    </>
  );
}
