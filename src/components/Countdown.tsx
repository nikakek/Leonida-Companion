"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/** Local midnight on launch day, in the visitor's own timezone. No exact release time is implied. */
function launchTarget(): number {
  const [year, month, day] = siteConfig.launchDate.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0).getTime();
}

function remainingLabel(now: number, target: number): string {
  const diff = target - now;
  if (diff <= 0) return "Out now";
  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  return `${days}d ${hours}h ${mins}m`;
}

/** "Launch Day" chip. The countdown text renders only after mount to avoid hydration mismatch. */
export function Countdown() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const target = launchTarget();
    const tick = () => setLabel(remainingLabel(Date.now(), target));
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const isOut = label === "Out now";

  return (
    <p className="inline-flex min-h-10 items-center gap-2.5 rounded-full bg-card py-1.5 pr-4 pl-1.5 text-[15px]">
      <span className="rounded-full bg-accent px-3 py-1 text-[13px] font-semibold text-on-accent">
        {isOut ? "Out now" : "Launch Day"}
      </span>
      <span className="font-medium">{siteConfig.launchLabel}</span>
      {!isOut ? (
        <span
          className="inline-block min-w-[10ch] font-mono text-[13px] text-muted tabular-nums"
          aria-live="off"
        >
          {label ? <span>{label}</span> : <span className="invisible">00d 00h 00m</span>}
        </span>
      ) : null}
    </p>
  );
}
