"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="flex flex-col items-start gap-5 py-10 md:py-16">
      <p className="eyebrow text-danger">Signal lost</p>
      <h1 className="page-title">Something Went Wrong</h1>
      <div className="sunset-line w-40" aria-hidden="true" />
      <p className="max-w-lg text-[16px] text-muted">This page hit an unexpected error. Try again, or head back home.</p>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={reset} className="btn-primary">
          Try Again
        </button>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
