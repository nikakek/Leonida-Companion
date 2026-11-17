import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { AffiliateCard } from "@/components/AffiliateCard";
import { PageIntro } from "@/components/PageIntro";
import { AMAZON_ASSOCIATE_STATEMENT, affiliateUrls, isProduction } from "@/config/monetization";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Deals: Gift Cards, Storage and Controllers",
  description:
    "Gift cards, console storage and controllers for PS5 and Xbox Series X|S. Every link is clearly labeled as an affiliate link.",
  path: "/deals",
});

const hasAnyDeal = Object.values(affiliateUrls).some(Boolean);

const REGION_NOTE = "Check that the card matches your PlayStation/Xbox account region.";

export default function DealsPage() {
  return (
    <>
      <PageIntro title="Deals">
        <p>
          Gift cards, storage and controllers for your console. Every card below is an affiliate link.{" "}
          <Link href="/affiliate-disclosure" className="text-link">
            How affiliate links work
          </Link>
          .
        </p>
      </PageIntro>

      <section aria-labelledby="deals-title">
        <h2 id="deals-title" className="sr-only">
          Affiliate picks
        </h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>li:empty]:hidden">
          <li>
            <AffiliateCard
              title="PSN Gift Cards"
              description="Digital PlayStation Store credit for games, add-ons and subscriptions."
              href={affiliateUrls.psn}
              envVar="NEXT_PUBLIC_AFF_PSN_URL"
              merchant="Partner store"
              badge="Gift card"
              note={REGION_NOTE}
              accent="#5B8DFF"
            />
          </li>
          <li>
            <AffiliateCard
              title="Xbox Gift Cards"
              description="Digital Microsoft Store credit for Xbox games, add-ons and subscriptions."
              href={affiliateUrls.xbox}
              envVar="NEXT_PUBLIC_AFF_XBOX_URL"
              merchant="G2A / Eneba"
              badge="Gift card"
              note={REGION_NOTE}
              accent="#3FB950"
            />
          </li>
          <li>
            <AffiliateCard
              title="2TB PS5-Compatible NVMe SSD"
              description="An M.2 NVMe drive for the PS5 expansion slot. Check it against Sony's PS5 storage requirements before buying."
              href={affiliateUrls.ssd}
              envVar="NEXT_PUBLIC_AFF_SSD_URL"
              merchant="Amazon"
              badge="Storage"
              note="Rockstar lists the pre-load at up to 212 GB. Final install size may differ, so check the current requirement."
              accent="#8A4DFF"
            />
          </li>
          <li>
            <AffiliateCard
              title="DualSense Controller"
              description="Sony's wireless controller for PS5."
              href={affiliateUrls.dualsense}
              envVar="NEXT_PUBLIC_AFF_DUALSENSE_URL"
              merchant="Amazon"
              badge="Controller"
              accent="#FF4FA3"
            />
          </li>
          <li>
            <AffiliateCard
              title="Xbox Storage Expansion"
              description="Expansion storage for Xbox Series X|S. Check compatibility with your console before buying."
              href={affiliateUrls.xboxStorage}
              envVar="NEXT_PUBLIC_AFF_XBOX_STORAGE_URL"
              merchant="Amazon"
              badge="Storage"
              accent="#2EE6A6"
            />
          </li>
        </ul>
        {isProduction && !hasAnyDeal ? (
          <p className="rounded-card bg-card p-5 text-muted md:p-8">No deals are listed right now. Check back soon.</p>
        ) : null}
      </section>

      <div className="mt-10 flex flex-col gap-2 rounded-card border border-line-strong p-5 text-[15px] text-muted md:p-6">
        <p>{AMAZON_ASSOCIATE_STATEMENT}</p>
        <p>
          Prices and availability are set by each store and can change. We do not list prices or make discount claims.
        </p>
      </div>

      <AdSlot id="deals-bottom" size="banner" />
    </>
  );
}
