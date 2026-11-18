"use client";

import type { CSSProperties } from "react";
import { getRegion } from "@/config/regions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { SubmitTrigger } from "@/components/submit/SubmitTrigger";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Submissions saved on this device. Rendered at the page bottom so the stored list cannot shift content. */
export function YourSubmissions() {
  const { submissions } = useSubmissions();
  return (
    <section aria-labelledby="your-submissions-title" className="mt-16">
      <p className="eyebrow mb-2">Saved on this device</p>
      <h2 id="your-submissions-title" className="section-title mb-2">
        Your Submissions
      </h2>
      <p className="mb-5 text-[15px] text-muted">Saved on this device only. Each one is reviewed by hand before anything is published.</p>
      {submissions.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-card border border-dashed border-line-strong p-5 md:p-6">
          <p className="text-muted">You have not submitted anything yet. Found a secret or a working cheat?</p>
          <SubmitTrigger className="btn-primary">Submit a Discovery</SubmitTrigger>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {submissions.map((item) => (
            <li key={item.id} className="stripe-row flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3.5 pl-5" style={{ "--stripe": "#FFB547" } as CSSProperties}>
              <span className="min-w-0 flex-1 basis-56">
                <span className="block font-medium">{item.title}</span>
                <span className="block font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
                  {item.category} · {getRegion(item.region).name} · {dateFormat.format(new Date(item.createdAt))}
                </span>
              </span>
              <span className="rounded-[4px] border border-warn/40 px-2 py-1 font-mono text-[10px] leading-none tracking-[0.1em] text-warn uppercase">
                Pending review
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
