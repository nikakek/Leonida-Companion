"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

const SAME_TAB_EVENT = "leonida:local-storage";

/** In-memory fallback when localStorage throws (private mode, quota, disabled). */
const memoryFallback = new Map<string, string>();

/** Per-key parse cache so getSnapshot returns a stable reference. */
const parseCache = new Map<string, { raw: string; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return raw;
  } catch {
    // Storage unavailable; fall through to memory.
  }
  return memoryFallback.get(key) ?? null;
}

function writeRaw(key: string, raw: string): void {
  memoryFallback.set(key, raw);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // Quota exceeded or storage disabled: the memory fallback keeps this tab working.
  }
  window.dispatchEvent(new CustomEvent<string>(SAME_TAB_EVENT, { detail: key }));
}

function parseCached<T>(key: string, raw: string, fallback: T): T {
  const cached = parseCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: T;
  try {
    value = JSON.parse(raw) as T;
  } catch {
    value = fallback;
  }
  parseCache.set(key, { raw, value });
  return value;
}

type SetValue<T> = (next: T | ((previous: T) => T)) => void;

/**
 * Persisted state backed by localStorage.
 * Server render and first client render use `defaultValue`, so markup always matches.
 * `defaultValue` is captured once; later changes to it are ignored.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, SetValue<T>] {
  const [initial] = useState(defaultValue);

  const subscribe = useCallback(
    (onChange: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === key) onChange();
      };
      const onSameTab = (event: Event) => {
        if ((event as CustomEvent<string>).detail === key) onChange();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(SAME_TAB_EVENT, onSameTab);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(SAME_TAB_EVENT, onSameTab);
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): T => {
    const raw = readRaw(key);
    return raw === null ? initial : parseCached(key, raw, initial);
  }, [key, initial]);

  const getServerSnapshot = useCallback((): T => initial, [initial]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback<SetValue<T>>(
    (next) => {
      const raw = readRaw(key);
      const previous = raw === null ? initial : parseCached(key, raw, initial);
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(previous) : next;
      let serialized: string;
      try {
        serialized = JSON.stringify(resolved);
      } catch {
        return;
      }
      writeRaw(key, serialized);
    },
    [key, initial],
  );

  return [value, setValue];
}
