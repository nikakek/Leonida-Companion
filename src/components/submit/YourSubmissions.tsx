"use client";

import { getRegion } from "@/config/regions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { SubmitTrigger } from "@/components/submit/SubmitTrigger";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Submissions saved on this device. Rendered at the page bottom so the stored list cannot shift content. */
export function YourSubmissions() {
  const { submissions } = useSubmissions();
  return (
    <section aria-labelledby="your-submissions-title" className="mt-16">
      <h2 id="your-submissions-title" className="section-title mb-2">
        Your Submissions
      </h2>
      <p className="mb-6 text-muted">Saved on this device only. Each one is reviewed by hand before anything is published.</p>
      {submissions.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-card bg-card p-5 md:p-8">
          <p className="text-muted">You have not submitted anything yet. Found a secret or a working cheat?</p>
          <SubmitTrigger className="btn-primary">Submit a Discovery</SubmitTrigger>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {submissions.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-card px-5 py-4">
              <span className="min-w-0 flex-1 basis-56">
                <span className="block font-medium">{item.title}</span>
                <span className="block text-[14px] text-muted">
                  {item.category} · {getRegion(item.region).name} · {dateFormat.format(new Date(item.createdAt))}
                </span>
              </span>
              <span className="rounded-full bg-warn/12 px-2.5 py-1 font-mono text-[11px] leading-none tracking-wide text-warn uppercase">
                Pending review
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
