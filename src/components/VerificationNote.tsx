import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";

interface VerificationNoteProps {
  /** ISO date of the newest check in the data shown on the page. */
  updated: string;
  /** True once everything on the page is confirmed: only the date is shown. */
  allConfirmed?: boolean;
  children?: ReactNode;
}

/**
 * Makes the pre-launch state explicit: what is unverified, that it is being updated at launch,
 * and when the data was last touched. Server-rendered so the date is crawlable.
 */
export function VerificationNote({ updated, allConfirmed = false, children }: VerificationNoteProps) {
  return (
    <aside
      aria-label="Verification status"
      className={`mb-6 flex max-w-2xl flex-col gap-1.5 rounded-md border px-3.5 py-3 text-[14px] ${
        allConfirmed ? "border-line text-muted" : "border-dashed border-warn/50 bg-warn/5 text-fg/90"
      }`}
    >
      {allConfirmed ? null : (
        <p>
          <strong className="font-semibold text-warn">Not verified yet, updating at launch.</strong> {children}
        </p>
      )}
      <p className="font-mono text-[12px] tracking-[0.04em] text-muted">
        Last updated <time dateTime={updated}>{formatDate(updated)}</time>
      </p>
    </aside>
  );
}
