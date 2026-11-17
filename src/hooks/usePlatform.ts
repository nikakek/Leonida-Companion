"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Platform } from "@/data/cheats";

export const PLATFORM_KEY = "leonida:platform";

/** Selected controller platform, shared across components and persisted. Defaults to PS5. */
export function usePlatform() {
  const [stored, setPlatform] = useLocalStorage<Platform>(PLATFORM_KEY, "ps5");
  const platform: Platform = stored === "xbox" ? "xbox" : "ps5";
  return [platform, setPlatform] as const;
}
