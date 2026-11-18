"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Sends one anonymous page-view ping per route change (production only) for aggregate hourly counts.
 * Only the path, and on the landing page the referrer, are sent. Skipped under Global Privacy Control / Do Not Track.
 */
export function VisitBeacon() {
  const pathname = usePathname();
  const isEntry = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.globalPrivacyControl || nav.doNotTrack === "1") return;

    const entry = isEntry.current;
    isEntry.current = false;
    const body = JSON.stringify({ path: pathname, referrer: entry ? document.referrer : "internal", entry });
    try {
      const sent = navigator.sendBeacon?.("/api/visit", new Blob([body], { type: "application/json" }));
      if (!sent) {
        void fetch("/api/visit", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
      }
    } catch {
      // Counting is best-effort and must never affect the page.
    }
  }, [pathname]);

  return null;
}
