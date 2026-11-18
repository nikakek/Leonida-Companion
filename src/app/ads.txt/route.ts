import { adsenseClientId } from "@/config/monetization";

// Built once at build time: redeploy after changing ADS_TXT or NEXT_PUBLIC_ADSENSE_CLIENT.
export const dynamic = "force-static";

/**
 * /ads.txt from env vars. `ADS_TXT` wins (full file content; separate lines with real newlines or "\n").
 * Otherwise the Google line is derived from NEXT_PUBLIC_ADSENSE_CLIENT. With neither set: 404.
 */
function adsTxt(): string | undefined {
  const custom = process.env.ADS_TXT?.trim();
  if (custom) return custom.replace(/\\n/g, "\n");
  if (adsenseClientId) return `google.com, ${adsenseClientId.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
  return undefined;
}

export function GET() {
  const body = adsTxt();
  if (!body) return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
