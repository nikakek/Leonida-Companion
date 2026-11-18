import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { isSameOrigin } from "@/lib/sameOrigin";
import { validateSubmission, type Submission } from "@/lib/submission";
import { webhookBody, webhookKind, type SubmissionRecord } from "@/lib/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Submissions are NEVER auto-published. They are forwarded for manual review only.

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 10 * 60;
const WEBHOOK_TIMEOUT_MS = 5000;

function json(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
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
  const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL?.trim();
  const record: SubmissionRecord = { ...submission, status: "pending_review", receivedAt: new Date().toISOString() };

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
      body: webhookBody(webhookUrl, record),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!response.ok) {
      // Status and webhook type only: no URL (it is a secret) and no submission content.
      console.error(`[submit] webhook rejected the request: HTTP ${response.status} (${webhookKind(webhookUrl)})`);
    }
    return response.ok;
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown error";
    console.error(`[submit] webhook request failed: ${reason} (${webhookKind(webhookUrl)})`);
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, error: "Cross-origin requests are not allowed." }, 403);
  }

  const { limited, retryAfterSeconds } = await rateLimit(clientIp(request), {
    name: "submit",
    limit: RATE_LIMIT,
    windowSeconds: RATE_WINDOW_SECONDS,
  });
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
