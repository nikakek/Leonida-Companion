import type { NextRequest } from "next/server";
import { isSameOrigin } from "@/lib/sameOrigin";
import { sendTelegram, telegramConfigured } from "@/lib/telegram";
import { upstashConfig, upstashPipeline } from "@/lib/upstash";
import {
  INCREMENT_SCRIPT,
  SPIKE_MILESTONES,
  VISIT_TTL_SECONDS,
  countryFromHeaders,
  deviceFromUserAgent,
  digestTimeZone,
  hourStart,
  isBot,
  normalizePath,
  referrerSource,
  spikeMessage,
  visitKey,
} from "@/lib/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Aggregate page-view counter for the owner's Telegram digest. Stores hourly totals only:
// no IP address, city, user agent string or identifier. See /privacy.

const MAX_BODY_BYTES = 1024;
const done = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return new Response(null, { status: 403 });

  const userAgent = request.headers.get("user-agent") ?? "";
  // Respect Global Privacy Control / Do Not Track, and skip crawlers.
  if (request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1" || isBot(userAgent)) return done();

  const redis = upstashConfig();
  if (!redis) return done();

  if (Number(request.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return done();
  let payload: { path?: unknown; referrer?: unknown; entry?: unknown };
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return done();
    payload = JSON.parse(text) as typeof payload;
  } catch {
    return done();
  }

  const ownHost = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(":")[0];
  const entry = payload.entry === true;
  const fields = [
    `p:${normalizePath(payload.path)}`,
    `c:${countryFromHeaders(request.headers)}`,
    `d:${deviceFromUserAgent(userAgent)}`,
    // Sources are counted once per visit (on the landing page), so internal navigation does not dilute them.
    ...(entry ? ["entry", `r:${referrerSource(typeof payload.referrer === "string" ? payload.referrer : "", ownHost)}`] : []),
  ];

  const now = new Date();
  const results = await upstashPipeline(redis, [["EVAL", INCREMENT_SCRIPT, 1, visitKey(now), ...fields, VISIT_TTL_SECONDS]]);
  const total = results?.[0];
  if (typeof total === "number" && SPIKE_MILESTONES.includes(total) && telegramConfigured()) {
    await sendTelegram(spikeMessage(total, hourStart(now), digestTimeZone()));
  }
  return done();
}
