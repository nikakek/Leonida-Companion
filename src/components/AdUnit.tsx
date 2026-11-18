"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/** One AdSense unit that fills its fixed-height parent. The loader script is added once in the layout. */
export function AdUnit({ client, slot }: { client: string; slot: string }) {
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // An ad blocker or a failed script load must never break the page.
    }
  }, []);

  return <ins className="adsbygoogle block h-full w-full" data-ad-client={client} data-ad-slot={slot} />;
}
