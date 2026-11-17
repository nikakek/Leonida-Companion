import { DevPlaceholder } from "@/components/DevPlaceholder";
import { ExternalIcon } from "@/components/Icons";
import { Thumb } from "@/components/Thumb";
import { COMMISSION_NOTE, isProduction } from "@/config/monetization";

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
  /** Env var name, shown in the dev-only placeholder when `href` is missing. */
  envVar: string;
}

/** Labeled affiliate link in the card pattern. Renders nothing in production without a URL. */
export function AffiliateCard({ title, description, href, merchant, priceNote, badge, note, accent, envVar }: AffiliateCardProps) {
  if (!href) {
    return isProduction ? null : <DevPlaceholder label={`Affiliate card "${title}"`} envVar={envVar} className="h-full min-h-48" />;
  }

  return (
    <article className="card-lift relative flex h-full flex-col overflow-hidden rounded-card bg-card">
      <Thumb accent={accent} seed={`deal-${title}`} className="block aspect-video w-full" />
      <div className="flex flex-1 flex-col justify-between gap-5 p-5 md:p-8">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[11px] leading-none tracking-wide text-muted uppercase">
              Affiliate link
            </span>
            {badge ? (
              <span className="rounded-full bg-accent/12 px-2.5 py-1 font-mono text-[11px] leading-none tracking-wide text-accent uppercase">
                {badge}
              </span>
            ) : null}
          </div>
          <h3 className="card-title">
            <a href={href} target="_blank" rel="sponsored noopener noreferrer" className="card-link">
              {title}
              <span className="sr-only"> at {merchant} (affiliate link, opens in a new tab)</span>
            </a>
          </h3>
          <p className="mt-2 text-muted">{description}</p>
          {note ? <p className="mt-3 text-[15px] text-fg">{note}</p> : null}
          {priceNote ? <p className="mt-2 text-[15px] text-muted">{priceNote}</p> : null}
        </div>
        <div className="flex flex-col gap-2 text-muted">
          <span className="inline-flex items-center gap-2 font-medium text-fg">
            {merchant}
            <ExternalIcon />
          </span>
          <span className="text-[14px]">{COMMISSION_NOTE}</span>
        </div>
      </div>
    </article>
  );
}
