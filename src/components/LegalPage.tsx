import type { ReactNode } from "react";
import { PageIntro } from "@/components/PageIntro";
import { formatDate } from "@/lib/format";

export const LEGAL_UPDATED = "2026-11-17";

/** Readable long-form layout for legal pages. */
export function LegalPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <PageIntro title={title}>
        {intro}
        <p className="mt-2 text-[15px]">Last updated {formatDate(LEGAL_UPDATED)}</p>
      </PageIntro>
      <div className="legal-prose flex flex-col gap-8 text-muted">
        {children}
      </div>
    </div>
  );
}
