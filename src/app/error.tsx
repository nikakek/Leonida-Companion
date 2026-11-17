"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="flex flex-col items-start gap-5 py-12 md:py-20">
      <h1 className="page-title">Something Went Wrong</h1>
      <p className="max-w-xl text-[17px] text-muted">
        This page hit an unexpected error. Try again, or head back home.
      </p>
      <div className="flex flex-wrap gap-3">
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
