import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { AMAZON_ASSOCIATE_STATEMENT, COMMISSION_NOTE } from "@/config/monetization";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Affiliate Disclosure",
  description: `How affiliate links work on ${siteConfig.name}.`,
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage title="Affiliate Disclosure" intro={<p>Some links on this site earn us a commission. Here is how that works.</p>}>
      <section>
        <h2>How It Works</h2>
        <p>
          Links on the <Link href="/deals" className="text-link">Deals</Link> page are affiliate links. {COMMISSION_NOTE}{" "}
          Each one is labeled &ldquo;Affiliate link&rdquo; and uses <code className="font-mono text-[14px]">rel=&quot;sponsored&quot;</code>.
        </p>
      </section>
      <section>
        <h2>Amazon Associates</h2>
        <p>{AMAZON_ASSOCIATE_STATEMENT}</p>
      </section>
      <section>
        <h2>Our Approach</h2>
        <ul>
          <li>Affiliate links appear only on the Deals page, never inside cheat or radio lists.</li>
          <li>We do not list prices or make discount, &ldquo;best&rdquo; or &ldquo;cheapest&rdquo; claims.</li>
          <li>Commissions never change which cheats, songs or locations we list, or how we label them.</li>
        </ul>
      </section>
      <section>
        <h2>Partners</h2>
        <p>
          Partners may include Amazon, G2A and Eneba. Gift cards are region-locked, so check that a card matches your
          PlayStation or Xbox account region before buying.
        </p>
      </section>
    </LegalPage>
  );
}
