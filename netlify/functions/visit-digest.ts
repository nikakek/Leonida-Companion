/**
 * Netlify scheduled function: at the top of every hour, sends the previous hour's visit totals to Telegram.
 * Needs UPSTASH_REDIS_REST_URL/TOKEN and TELEGRAM_BOT_TOKEN/CHAT_ID; DIGEST_TIMEZONE (IANA) is optional.
 * Runs only on published deploys. Test it from Netlify: Logs → Functions → visit-digest → Run now.
 * Imports use relative paths because Netlify bundles this file outside of Next.js.
 */
import { sendTelegram, telegramConfigured } from "../../src/lib/telegram";
import { upstashConfig, upstashPipeline } from "../../src/lib/upstash";
import { digestTimeZone, formatDigest, hourStart, parseHash, visitKey } from "../../src/lib/visits";

export default async function visitDigest(): Promise<Response> {
  const redis = upstashConfig();
  if (!redis || !telegramConfigured()) return new Response("Not configured", { status: 200 });

  const previousHour = hourStart(new Date(Date.now() - 60 * 60 * 1000));
  const results = await upstashPipeline(redis, [["HGETALL", visitKey(previousHour)]]);
  const text = formatDigest(parseHash(results?.[0]), previousHour, digestTimeZone());
  if (text) await sendTelegram(text);
  return new Response(text ? "Sent" : "No visits", { status: 200 });
}

export const config = { schedule: "@hourly" };
