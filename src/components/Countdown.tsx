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

/** Launch chip. The countdown text renders only after mount to avoid hydration mismatch. */
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
    <p className="inline-flex h-8 items-center gap-2.5 rounded-[4px] border border-line-strong bg-bg/70 pr-3 pl-2 font-mono text-[11px] tracking-[0.1em] uppercase">
      <span className="relative flex size-2">
        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-accent shadow-[0_0_8px_rgba(255,77,157,0.9)]" />
      </span>
      <span className="text-accent">{isOut ? "Out now" : "Launch"}</span>
      <span className="text-fg">{siteConfig.launchLabel}</span>
      {!isOut ? (
        <span className="inline-block min-w-[10ch] text-muted tabular-nums" aria-live="off">
          {label ? <span>{label}</span> : <span className="invisible">00d 00h 00m</span>}
        </span>
      ) : null}
    </p>
  );
}
