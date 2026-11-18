import { DevPlaceholder } from "@/components/DevPlaceholder";
import { ExternalIcon } from "@/components/Icons";
import { COMMISSION_NOTE, isProduction } from "@/config/monetization";

export type ProductIcon = "gift" | "ssd" | "controller" | "storage";

interface AffiliateCardProps {
  title: string;
  description: string;
  href: string | undefined;
  merchant: string;
  priceNote?: string;
  badge?: string;
  /** Factual buying note, e.g. region or size checks. */
  note?: string;
  accent: string;
  icon: ProductIcon;
  /** Env var name, shown in the dev-only placeholder when `href` is missing. */
  envVar: string;
}

/** Simple generic product glyphs (no brand marks). */
function ProductGlyph({ icon }: { icon: ProductIcon }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "gift":
      return (
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
          <rect x="3" y="6.5" width="20" height="13" rx="2" {...common} />
          <path d="M3 11h20M8 15.5h4" {...common} />
        </svg>
      );
    case "ssd":
      return (
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
          <rect x="2.5" y="9" width="21" height="8" rx="1.5" {...common} />
          <path d="M6 9v8M19 12h2M19 14h2M9 13h6" {...common} />
        </svg>
      );
    case "controller":
      return (
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
          <path d="M8 8h10a5.5 5.5 0 0 1 5.3 7l-1 3.5a2.5 2.5 0 0 1-4.3 1l-2-2.3h-6l-2 2.3a2.5 2.5 0 0 1-4.3-1l-1-3.5A5.5 5.5 0 0 1 8 8Z" {...common} />
          <path d="M8.5 11.5v3M7 13h3M17 12h.01M19 14h.01" {...common} />
        </svg>
      );
    case "storage":
      return (
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
          <rect x="6" y="3" width="14" height="20" rx="2" {...common} />
          <path d="M9.5 7h7M9.5 10h7M10 19h6" {...common} />
        </svg>
      );
  }
}

/** Labeled affiliate link. Restrained on purpose; renders nothing in production without a URL. */
export function AffiliateCard({ title, description, href, merchant, priceNote, badge, note, accent, icon, envVar }: AffiliateCardProps) {
  if (!href) {
    return isProduction ? null : <DevPlaceholder label={`Affiliate card "${title}"`} envVar={envVar} className="h-full min-h-48" />;
  }

  return (
    <article className="card-lift relative flex h-full flex-col rounded-card bg-card p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-md border border-line-strong bg-[#0b0b12]" style={{ color: accent }}>
          <ProductGlyph icon={icon} />
        </span>
        <span className="flex flex-col items-end gap-1.5">
          <span className="rounded-[4px] border border-line-strong px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            Affiliate link
          </span>
          {badge ? <span className="font-mono text-[10px] tracking-[0.12em] text-faint uppercase">{badge}</span> : null}
        </span>
      </div>
      <h3 className="card-title">
        <a href={href} target="_blank" rel="sponsored noopener noreferrer" className="card-link">
          {title}
          <span className="sr-only"> at {merchant} (affiliate link, opens in a new tab)</span>
        </a>
      </h3>
      <p className="mt-1.5 text-[14px] text-muted">{description}</p>
      {note ? <p className="mt-3 border-l-2 border-amber/60 pl-3 text-[13px] text-fg/90">{note}</p> : null}
      {priceNote ? <p className="mt-2 text-[13px] text-muted">{priceNote}</p> : null}
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-line pt-3.5">
          <span className="font-mono text-[11px] tracking-[0.06em] text-faint">{COMMISSION_NOTE}</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold">
            {merchant}
            <ExternalIcon size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
