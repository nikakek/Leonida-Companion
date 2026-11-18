/**
 * Netlify scheduled function: at the top of every hour, sends the previous hour's visit totals to Telegram.
 * Needs UPSTASH_REDIS_REST_URL/TOKEN and TELEGRAM_BOT_TOKEN/CHAT_ID; DIGEST_TIMEZONE (IANA) is optional.
 * Runs only on published deploys. Test it from Netlify: Logs → Functions → visit-digest → Run now (outcome is logged).
 * Imports use relative paths because Netlify bundles this file outside of Next.js.
 */
import { sendTelegram, telegramConfigured } from "../../src/lib/telegram";
import { upstashConfig, upstashPipeline } from "../../src/lib/upstash";
import { digestTimeZone, formatDigest, hourStart, parseHash, visitKey } from "../../src/lib/visits";

function finish(outcome: string): Response {
  console.log(`[visit-digest] ${outcome}`);
  return new Response(outcome, { status: 200 });
}

export default async function visitDigest(): Promise<Response> {
  const redis = upstashConfig();
  const missing = [
    ...(redis ? [] : ["UPSTASH_REDIS_REST_URL/TOKEN"]),
    ...(telegramConfigured() ? [] : ["TELEGRAM_BOT_TOKEN/CHAT_ID"]),
  ];
  if (!redis || missing.length > 0) return finish(`not configured, missing: ${missing.join(", ")}`);

  const previousHour = hourStart(new Date(Date.now() - 60 * 60 * 1000));
  const results = await upstashPipeline(redis, [["HGETALL", visitKey(previousHour)]]);
  if (!results) return finish("could not read visit counts from Upstash");

  const text = formatDigest(parseHash(results[0]), previousHour, digestTimeZone());
  if (!text) return finish(`no visits in the hour starting ${previousHour.toISOString()}, nothing sent`);

  const sent = await sendTelegram(text);
  return finish(sent ? "digest sent to Telegram" : "Telegram rejected the message (check token, chat ID, and that you pressed Start)");
}

export const config = { schedule: "@hourly" };
