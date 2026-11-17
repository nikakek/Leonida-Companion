import Link from "next/link";

export function EmptyState({ message, ctaLabel, ctaHref }: { message: string; ctaLabel: string; ctaHref: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card bg-card px-6 py-12 text-center">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true" focusable="false">
        <circle cx="24" cy="24" r="14" stroke="#B9B5D6" strokeWidth="2.5" />
        <path d="m34.5 34.5 10 10" stroke="#B9B5D6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M19 24h10" stroke="#FF9CCB" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p className="text-muted">{message}</p>
      <Link href={ctaHref} className="btn-primary">
        {ctaLabel}
      </Link>
    </div>
  );
}
