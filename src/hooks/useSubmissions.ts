"use client";

import { useMemo } from "react";
import { isRegionId, type RegionId } from "@/config/regions";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/events";
import type { SubmissionCategory } from "@/lib/submission";

/** Local copy of what the visitor submitted. Contact details are not stored. */
export interface LocalSubmission {
  id: string;
  title: string;
  region: RegionId;
  category: SubmissionCategory;
  createdAt: string;
}

const none: LocalSubmission[] = [];

export function useSubmissions() {
  const [stored, setStored] = useLocalStorage<LocalSubmission[]>(STORAGE_KEYS.submissions, none);
  // Ignore malformed entries (storage is user-editable).
  const submissions = useMemo(
    () =>
      Array.isArray(stored)
        ? stored.filter(
            (item): item is LocalSubmission =>
              typeof item === "object" &&
              item !== null &&
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              isRegionId(item.region) &&
              typeof item.createdAt === "string",
          )
        : none,
    [stored],
  );
  const add = (item: LocalSubmission) =>
    setStored((previous) => [item, ...(Array.isArray(previous) ? previous : [])].slice(0, 50));
  return { submissions, add };
}
