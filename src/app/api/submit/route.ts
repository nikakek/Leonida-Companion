import { NextResponse, type NextRequest } from "next/server";
import { validateSubmission, type Submission } from "@/lib/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Submissions are NEVER auto-published. They are forwarded for manual review only.

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const WEBHOOK_TIMEOUT_MS = 5000;

/**
 * In-memory, per-instance rate limit. On serverless platforms each instance has its own memory
 * and instances are recycled, so this is best-effort only. Use Redis / Upstash for a real limit.
 */
const hits = new Map<string, number[]>();

function json(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string, now: number): { limited: boolean; retryAfterSeconds: number } {
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return { limited: true, retryAfterSeconds: Math.ceil((recent[0] + RATE_WINDOW_MS - now) / 1000) };
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep memory bounded: drop stale keys occasionally.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return { limited: false, retryAfterSeconds: 0 };
}

function isSameOrigin(request: NextRequest): boolean {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  return request.headers.get("sec-fetch-site") === "same-origin";
}

/** Reads the body with a hard byte cap. Returns null when the cap is exceeded. */
async function readBodyCapped(request: NextRequest): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

async function forward(submission: Submission): Promise<boolean> {
  const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL;
  const record = { ...submission, status: "pending_review", receivedAt: new Date().toISOString() };

  // TODO: Supabase insert, e.g. `await supabase.from("submissions").insert(record)`, still pending review.

  if (!webhookUrl) {
    // Contact details are deliberately not logged.
    console.info("[submit] received (no SUBMISSION_WEBHOOK_URL set):", {
      title: record.title,
      region: record.region,
      category: record.category,
    });
    return true;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, error: "Cross-origin requests are not allowed." }, 403);
  }

  const { limited, retryAfterSeconds } = checkRateLimit(clientIp(request), Date.now());
  if (limited) {
    return json(
      { ok: false, error: "Too many submissions. Please try again later." },
      429,
      { "Retry-After": String(retryAfterSeconds) },
    );
  }

  const body = await readBodyCapped(request);
  if (body === null) return json({ ok: false, error: "Submission is too large." }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, 400);
  }

  // Honeypot: bots fill the hidden field. Pretend success and drop it silently.
  if (typeof payload === "object" && payload !== null && "website" in payload) {
    const trap = (payload as { website?: unknown }).website;
    if (typeof trap === "string" && trap.trim() !== "") return json({ ok: true }, 200);
  }

  const result = validateSubmission(payload);
  if (!result.ok) return json({ ok: false, error: "Please fix the highlighted fields.", errors: result.errors }, 400);

  const delivered = await forward(result.value);
  if (!delivered) return json({ ok: false, error: "Could not send your submission right now. Please try again." }, 502);

  return json({ ok: true }, 200);
}
