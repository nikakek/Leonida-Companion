// Monetization and analytics settings. All values come from env vars documented in .env.example.
// NEXT_PUBLIC_* vars must be referenced literally so Next.js can inline them at build time.
// Rule: a missing or malformed value means the related component renders nothing in production.

const clean = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

/** Only absolute https URLs are accepted, so a typo can never become a broken or unsafe link. */
const httpsUrl = (value: string | undefined): string | undefined => {
  const trimmed = clean(value);
  if (!trimmed) return undefined;
  try {
    return new URL(trimmed).protocol === "https:" ? trimmed : undefined;
  } catch {
    return undefined;
  }
};

const matching = (value: string | undefined, pattern: RegExp): string | undefined => {
  const trimmed = clean(value);
  return trimmed && pattern.test(trimmed) ? trimmed : undefined;
};

export const isProduction = process.env.NODE_ENV === "production";

export const affiliateUrls = {
  psn: httpsUrl(process.env.NEXT_PUBLIC_AFF_PSN_URL),
  xbox: httpsUrl(process.env.NEXT_PUBLIC_AFF_XBOX_URL),
  ssd: httpsUrl(process.env.NEXT_PUBLIC_AFF_SSD_URL),
  dualsense: httpsUrl(process.env.NEXT_PUBLIC_AFF_DUALSENSE_URL),
  xboxStorage: httpsUrl(process.env.NEXT_PUBLIC_AFF_XBOX_STORAGE_URL),
} as const;

export const hasAnyDeal = Object.values(affiliateUrls).some(Boolean);

/** Google AdSense. Ads render only when BOTH the publisher ID and the ad unit ID are set. */
const adsenseClient = matching(process.env.NEXT_PUBLIC_ADSENSE_CLIENT, /^ca-pub-\d{10,20}$/);
const adsenseSlot = matching(process.env.NEXT_PUBLIC_ADSENSE_SLOT, /^\d{6,20}$/);
export const adsense = adsenseClient && adsenseSlot ? ({ client: adsenseClient, slot: adsenseSlot } as const) : undefined;
/** Publisher ID alone is enough for the loader script (site review, Auto ads) and for ads.txt. */
export const adsenseClientId = adsenseClient;

export const analytics = {
  plausibleDomain: clean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
  plausibleScriptUrl: httpsUrl(process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL) ?? "https://plausible.io/js/script.js",
  umamiScriptUrl: httpsUrl(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL),
  umamiWebsiteId: clean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID),
} as const;

export const googleSiteVerification = clean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);

export const AMAZON_ASSOCIATE_STATEMENT = "As an Amazon Associate I earn from qualifying purchases.";
export const COMMISSION_NOTE = "We may earn a commission at no cost to you.";
