export const regions = [
  { id: "vice-city", name: "Vice City", color: "#FF2E93" },
  { id: "leonida-keys", name: "Leonida Keys", color: "#19E3FF" },
  { id: "grassrivers", name: "Grassrivers", color: "#3DDC84" },
  { id: "port-gellhorn", name: "Port Gellhorn", color: "#FFB547" },
  { id: "mount-kalaga", name: "Mount Kalaga", color: "#7B5CFF" },
  { id: "ambrosia", name: "Ambrosia", color: "#FF6B5E" },
] as const;

export type RegionId = (typeof regions)[number]["id"];
export type Region = (typeof regions)[number];

export function getRegion(id: RegionId): Region {
  const region = regions.find((item) => item.id === id);
  if (!region) throw new Error(`Unknown region: ${id}`);
  return region;
}

export function isRegionId(value: unknown): value is RegionId {
  return typeof value === "string" && regions.some((region) => region.id === value);
}
