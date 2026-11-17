// Update this file after launch; set status to confirmed only when verified in-game or from an official Rockstar source.

import type { Verifiable } from "@/lib/types";

export type Ps5Btn =
  | "triangle" | "circle" | "cross" | "square"
  | "l1" | "l2" | "r1" | "r2"
  | "up" | "down" | "left" | "right";

export type XboxBtn =
  | "y" | "b" | "a" | "x"
  | "lb" | "lt" | "rb" | "rt"
  | "up" | "down" | "left" | "right";

export type Platform = "ps5" | "xbox";

export const cheatCategories = ["Player", "Weapons", "Vehicles", "World"] as const;
export type CheatCategory = (typeof cheatCategories)[number];

export interface Cheat extends Verifiable {
  id: string;
  slug: string;
  title: string;
  category: CheatCategory;
  description: string;
  inputs: { ps5: Ps5Btn[]; xbox: XboxBtn[] };
}

const PLACEHOLDER = "Placeholder: unverified at launch. No combo is known yet.";
const LAST_VERIFIED = "2026-11-17";

/** Builds a placeholder entry. No combos are known before launch, so inputs stay empty. */
function placeholder(id: string, slug: string, title: string, category: CheatCategory, detail: string): Cheat {
  return {
    id,
    slug,
    title,
    category,
    description: `${PLACEHOLDER} ${detail}`,
    inputs: { ps5: [], xbox: [] },
    status: "testing",
    lastVerified: LAST_VERIFIED,
  };
}

export const cheats: Cheat[] = [
  placeholder("c01", "max-health-and-armor", "Max Health and Armor", "Player", "Slot reserved for a health and armor refill cheat, if one exists."),
  placeholder("c02", "lower-wanted-level", "Lower Wanted Level", "Player", "Slot reserved for a wanted-level reduction cheat, if one exists."),
  placeholder("c03", "raise-wanted-level", "Raise Wanted Level", "Player", "Slot reserved for a wanted-level increase cheat, if one exists."),
  placeholder("c04", "weapon-loadout", "Weapon Loadout", "Weapons", "Slot reserved for a weapon set cheat, if one exists."),
  placeholder("c05", "refill-ammo", "Refill Ammo", "Weapons", "Slot reserved for an ammo cheat, if one exists."),
  placeholder("c06", "explosive-rounds", "Explosive Rounds", "Weapons", "Slot reserved for an explosive ammo cheat, if one exists."),
  placeholder("c07", "spawn-sports-car", "Spawn Sports Car", "Vehicles", "Slot reserved for a car spawn cheat, if one exists."),
  placeholder("c08", "spawn-motorcycle", "Spawn Motorcycle", "Vehicles", "Slot reserved for a motorcycle spawn cheat, if one exists."),
  placeholder("c09", "spawn-boat", "Spawn Boat", "Vehicles", "Slot reserved for a boat spawn cheat, if one exists."),
  placeholder("c10", "change-weather", "Change Weather", "World", "Slot reserved for a weather cheat, if one exists."),
  placeholder("c11", "slow-motion", "Slow Motion", "World", "Slot reserved for a slow-motion cheat, if one exists."),
  placeholder("c12", "low-gravity", "Low Gravity", "World", "Slot reserved for a gravity cheat, if one exists."),
];

export const ps5Buttons: readonly Ps5Btn[] = [
  "triangle", "circle", "cross", "square", "l1", "l2", "r1", "r2", "up", "down", "left", "right",
];
export const xboxButtons: readonly XboxBtn[] = [
  "y", "b", "a", "x", "lb", "lt", "rb", "rt", "up", "down", "left", "right",
];

export const buttonNames: Record<Ps5Btn | XboxBtn, string> = {
  triangle: "Triangle", circle: "Circle", cross: "Cross", square: "Square",
  l1: "L1", l2: "L2", r1: "R1", r2: "R2",
  y: "Y", b: "B", a: "A", x: "X",
  lb: "LB", lt: "LT", rb: "RB", rt: "RT",
  up: "D-pad Up", down: "D-pad Down", left: "D-pad Left", right: "D-pad Right",
};

export const platformLabels: Record<Platform, string> = {
  ps5: "PlayStation (PS5)",
  xbox: "Xbox Series X|S",
};

/** The single rule for showing a combo: confirmed AND non-empty. */
export function hasVerifiedCombo(cheat: Cheat, platform: Platform): boolean {
  return cheat.status === "confirmed" && cheat.inputs[platform].length > 0;
}

export function getCheat(slug: string): Cheat | undefined {
  return cheats.find((cheat) => cheat.slug === slug);
}

/** Thumbnail tint per category (decorative only). */
export const categoryAccents: Record<CheatCategory, string> = {
  Player: "#FF4FA3",
  Weapons: "#FF9A3C",
  Vehicles: "#8A4DFF",
  World: "#3BA7FF",
};
