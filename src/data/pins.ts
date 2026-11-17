// Update this file after launch; set status to confirmed only when verified in-game or from an official Rockstar source.
// ALL pins below are SAMPLES that demonstrate the map. Their positions are not real game locations.
// Coordinates use the stylized map's viewBox (0 0 800 1000), not in-game coordinates.

import type { RegionId } from "@/config/regions";
import type { Verifiable } from "@/lib/types";

export const pinCategories = [
  { id: "easter-egg", name: "Easter Egg", color: "#FFD166" },
  { id: "collectible", name: "Collectible", color: "#5BE7FF" },
  { id: "stunt-jump", name: "Stunt Jump", color: "#FF8A5B" },
  { id: "safe-house", name: "Safe House", color: "#C4A7FF" },
] as const;

export type PinCategoryId = (typeof pinCategories)[number]["id"];

export interface Pin extends Verifiable {
  id: string;
  title: string;
  region: RegionId;
  category: PinCategoryId;
  description: string;
  x: number;
  y: number;
}

const LAST_VERIFIED = "2026-11-17";
const SAMPLE_NOTE = "Example pin that shows how map entries will work. Location unverified at launch.";

function sample(id: string, title: string, region: RegionId, category: PinCategoryId, x: number, y: number): Pin {
  return { id, title, region, category, description: SAMPLE_NOTE, x, y, status: "sample", lastVerified: LAST_VERIFIED };
}

export const pins: Pin[] = [
  sample("p01", "Sample Collectible A", "port-gellhorn", "collectible", 95, 185),
  sample("p02", "Sample Stunt Jump A", "port-gellhorn", "stunt-jump", 200, 205),
  sample("p03", "Sample Safe House A", "ambrosia", "safe-house", 300, 195),
  sample("p04", "Sample Easter Egg A", "ambrosia", "easter-egg", 415, 225),
  sample("p05", "Sample Easter Egg B", "mount-kalaga", "easter-egg", 540, 232),
  sample("p06", "Sample Collectible B", "mount-kalaga", "collectible", 650, 278),
  sample("p07", "Sample Stunt Jump B", "grassrivers", "stunt-jump", 468, 420),
  sample("p08", "Sample Safe House B", "grassrivers", "safe-house", 505, 618),
  sample("p09", "Sample Collectible C", "vice-city", "collectible", 645, 440),
  sample("p10", "Sample Easter Egg C", "vice-city", "easter-egg", 628, 650),
  sample("p11", "Sample Stunt Jump C", "leonida-keys", "stunt-jump", 560, 836),
  sample("p12", "Sample Safe House C", "leonida-keys", "safe-house", 415, 896),
];

export function getPinCategory(id: PinCategoryId) {
  const category = pinCategories.find((item) => item.id === id);
  if (!category) throw new Error(`Unknown pin category: ${id}`);
  return category;
}
