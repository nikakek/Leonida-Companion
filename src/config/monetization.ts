// Monetization and analytics settings. All values come from env vars documented in .env.example.
// NEXT_PUBLIC_* vars must be referenced literally so Next.js can inline them at build time.

const clean = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const isProduction = process.env.NODE_ENV === "production";

export const affiliateUrls = {
  psn: clean(process.env.NEXT_PUBLIC_AFF_PSN_URL),
  xbox: clean(process.env.NEXT_PUBLIC_AFF_XBOX_URL),
  ssd: clean(process.env.NEXT_PUBLIC_AFF_SSD_URL),
  dualsense: clean(process.env.NEXT_PUBLIC_AFF_DUALSENSE_URL),
  xboxStorage: clean(process.env.NEXT_PUBLIC_AFF_XBOX_STORAGE_URL),
} as const;

export const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export const analytics = {
  plausibleDomain: clean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
  umamiScriptUrl: clean(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL),
  umamiWebsiteId: clean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID),
} as const;

export const AMAZON_ASSOCIATE_STATEMENT = "As an Amazon Associate I earn from qualifying purchases.";
export const COMMISSION_NOTE = "We may earn a commission at no cost to you.";
