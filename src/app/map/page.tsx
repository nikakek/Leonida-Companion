import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageIntro";
import { VerificationNote } from "@/components/VerificationNote";
import { MapExplorer } from "@/components/map/MapExplorer";
import { YourSubmissions } from "@/components/submit/YourSubmissions";
import { regions } from "@/config/regions";
import { pinCategories, pins } from "@/data/pins";
import { GAME_NAME, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { countByStatus, latestVerified } from "@/lib/verification";

export const metadata: Metadata = pageMetadata({
  title: `${GAME_NAME} Map: Leonida Regions, Secrets and Progress Tracker`,
  description: `A stylized ${GAME_NAME} map of Leonida for tracking Easter eggs, collectibles, stunt jumps and safe houses on your device. Pins are samples until locations are verified in-game.`,
  path: "/map",
  image: "/map/opengraph-image",
});

const { confirmed } = countByStatus(pins);
const updated = latestVerified(pins);
const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
const crumbs = [
  { name: "Home", href: "/" },
  { name: "Map", href: "/map" },
];

export default function MapPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageIntro title="Map" eyebrow={`${regions.length} regions · ${confirmed > 0 ? `${confirmed} verified pins` : `${pins.length} sample pins`}`}>
        <p>Tap a region to zoom in, tap a pin for details, and mark what you find. Progress is saved on this device.</p>
      </PageIntro>
      <VerificationNote updated={updated} allConfirmed={confirmed === pins.length}>
        {confirmed === 0
          ? `All ${pins.length} pins are samples that show how the map works. They are not real locations.`
          : `${confirmed} of ${pins.length} pins are confirmed. The rest are samples or still being checked.`}{" "}
        Real pins are added once a location is found and checked in-game.
      </VerificationNote>
      <MapExplorer />
      <section aria-labelledby="map-about-title" className="mt-14 max-w-3xl">
        <h2 id="map-about-title" className="section-title mb-3">
          About This {GAME_NAME} Map
        </h2>
        <div className="flex flex-col gap-3 text-[15px] text-muted">
          <p>
            This is a stylized, not-to-scale drawing of the State of Leonida, not the in-game map. It covers{" "}
            {regions.length} regions: {listFormat.format(regions.map((region) => region.name))}.
          </p>
          <p>
            Pins come in {pinCategories.length} types: {listFormat.format(pinCategories.map((category) => category.name.toLowerCase()))}.
            Every pin shows its status, and nothing is marked Confirmed until it is verified in-game or by an official
            Rockstar source. Found something? Use Submit a Discovery and it is reviewed by hand.
          </p>
        </div>
      </section>
      <YourSubmissions />
    </>
  );
}
