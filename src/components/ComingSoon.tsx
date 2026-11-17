import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

/** Temporary placeholder for sections that ship in a later phase. */
export function ComingSoon({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageIntro title={title}>{children}</PageIntro>
      <div className="flex flex-col items-start gap-4 rounded-card bg-card p-5 md:p-8">
        <p className="card-title">Coming Soon</p>
        <p className="text-muted">This section is being built and will be available shortly.</p>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </>
  );
}
