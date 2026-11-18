import Script from "next/script";
import { adsenseClientId, analytics, isProduction } from "@/config/monetization";

/**
 * Third-party scripts, production only, each gated on its env var:
 * privacy-friendly analytics (Plausible or Umami) and the AdSense loader.
 * AdSense shows its own consent message (Privacy & messaging in the AdSense dashboard) for EU/UK/CH visitors.
 */
export function Analytics() {
  if (!isProduction) return null;
  return (
    <>
      {analytics.plausibleDomain ? (
        <Script src={analytics.plausibleScriptUrl} data-domain={analytics.plausibleDomain} strategy="afterInteractive" />
      ) : analytics.umamiScriptUrl && analytics.umamiWebsiteId ? (
        <Script src={analytics.umamiScriptUrl} data-website-id={analytics.umamiWebsiteId} strategy="afterInteractive" />
      ) : null}
      {adsenseClientId ? (
        // Plain async tag on purpose: AdSense rejects the extra attributes next/script adds.
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
      ) : null}
    </>
  );
}
