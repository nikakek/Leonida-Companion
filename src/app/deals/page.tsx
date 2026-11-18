import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { AffiliateCard } from "@/components/AffiliateCard";
import { PageIntro } from "@/components/PageIntro";
import { AMAZON_ASSOCIATE_STATEMENT, affiliateUrls, hasAnyDeal, isProduction } from "@/config/monetization";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Deals: Gift Cards, Storage and Controllers",
  description:
    "Gift cards, console storage and controllers for PS5 and Xbox Series X|S. Every link is clearly labeled as an affiliate link.",
  path: "/deals",
  // An empty deals page (no affiliate URLs configured) stays out of search results and the sitemap.
  noindex: !hasAnyDeal,
});

const REGION_NOTE = "Check that the card matches your PlayStation/Xbox account region.";

export default function DealsPage() {
  return (
    <>
      <PageIntro title="Deals" eyebrow="Partner links · affiliate">
        <p>
          Gift cards, storage and controllers for your console. Every card below is an affiliate link.{" "}
          <Link href="/affiliate-disclosure" className="text-link">
            How affiliate links work
          </Link>
          .
        </p>
      </PageIntro>

      <section aria-labelledby="deals-title">
        <div className="mb-4 flex items-center gap-3">
          <h2 id="deals-title" className="eyebrow text-violet">
            Partner zone
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <span className="font-mono text-[11px] tracking-[0.08em] text-faint uppercase">Separate from gameplay tools</span>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 2xl:grid-cols-4 [&>li:empty]:hidden">
          <li>
            <AffiliateCard
              title="PSN Gift Cards"
              description="Digital PlayStation Store credit for games, add-ons and subscriptions."
              href={affiliateUrls.psn}
              envVar="NEXT_PUBLIC_AFF_PSN_URL"
              icon="gift"
              merchant="Partner store"
              badge="Gift card"
              note={REGION_NOTE}
              accent="#3DE3F0"
            />
          </li>
          <li>
            <AffiliateCard
              title="Xbox Gift Cards"
              description="Digital Microsoft Store credit for Xbox games, add-ons and subscriptions."
              href={affiliateUrls.xbox}
              envVar="NEXT_PUBLIC_AFF_XBOX_URL"
              icon="gift"
              merchant="G2A / Eneba"
              badge="Gift card"
              note={REGION_NOTE}
              accent="#3DE3F0"
            />
          </li>
          <li>
            <AffiliateCard
              title="2TB PS5-Compatible NVMe SSD"
              description="An M.2 NVMe drive for the PS5 expansion slot. Check it against Sony's PS5 storage requirements before buying."
              href={affiliateUrls.ssd}
              envVar="NEXT_PUBLIC_AFF_SSD_URL"
              icon="ssd"
              merchant="Amazon"
              badge="Storage"
              note="Check the game's install size on your console's store page before choosing a capacity."
              accent="#9D7BFF"
            />
          </li>
          <li>
            <AffiliateCard
              title="DualSense Controller"
              description="Sony's wireless controller for PS5."
              href={affiliateUrls.dualsense}
              envVar="NEXT_PUBLIC_AFF_DUALSENSE_URL"
              icon="controller"
              merchant="Amazon"
              badge="Controller"
              accent="#9D7BFF"
            />
          </li>
          <li>
            <AffiliateCard
              title="Xbox Storage Expansion"
              description="Expansion storage for Xbox Series X|S. Check compatibility with your console before buying."
              href={affiliateUrls.xboxStorage}
              envVar="NEXT_PUBLIC_AFF_XBOX_STORAGE_URL"
              icon="storage"
              merchant="Amazon"
              badge="Storage"
              accent="#9D7BFF"
            />
          </li>
        </ul>
        {isProduction && !hasAnyDeal ? (
          <p className="rounded-card border border-dashed border-line-strong p-5 text-muted">No deals are listed right now. Check back soon.</p>
        ) : null}
      </section>

      <div className="mt-8 flex flex-col gap-2 rounded-card border border-line p-4 font-mono text-[12px] leading-relaxed text-muted md:p-5">
        <p>{AMAZON_ASSOCIATE_STATEMENT}</p>
        <p>
          Prices and availability are set by each store and can change. We do not list prices or make discount claims.
        </p>
      </div>

      <AdSlot id="deals-bottom" size="banner" />
    </>
  );
}
