import Script from "next/script";
import { analytics, isProduction } from "@/config/monetization";

/** Optional privacy-friendly analytics (Plausible or Umami), production only. */
export function Analytics() {
  if (!isProduction) return null;
  if (analytics.plausibleDomain) {
    return (
      <Script
        src="https://plausible.io/js/script.js"
        data-domain={analytics.plausibleDomain}
        strategy="afterInteractive"
      />
    );
  }
  if (analytics.umamiScriptUrl && analytics.umamiWebsiteId) {
    return (
      <Script src={analytics.umamiScriptUrl} data-website-id={analytics.umamiWebsiteId} strategy="afterInteractive" />
    );
  }
  return null;
}
