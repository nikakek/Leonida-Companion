import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  robots: { index: false, follow: true },
};

export default function AffiliateDisclosurePage() {
  return (
    <ComingSoon title="Affiliate Disclosure">
      <p>There are no affiliate links on this site yet. This page will list how they work once they are added.</p>
    </ComingSoon>
  );
}
