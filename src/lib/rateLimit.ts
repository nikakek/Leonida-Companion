import { createHash } from "node:crypto";

/**
 * Fixed-window rate limit for /api/submit.
 * - With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set, counts live in Upstash Redis (REST API,
 *   no SDK), so the limit holds across serverless instances.
 * - Without them, or if Upstash is unreachable, it falls back to per-instance memory (best-effort).
 * Keys are a SHA-256 hash of the client IP; raw IPs are never stored.
 */

export interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
  backend: "upstash" | "memory";
}

interface RateLimitOptions {
  /** Namespace for the counter, e.g. "submit". */
  name: string;
  limit: number;
  windowSeconds: number;
}

const UPSTASH_TIMEOUT_MS = 2000;

const hits = new Map<string, number[]>();

function memoryLimit(key: string, { limit, windowSeconds }: RateLimitOptions, now: number): RateLimitResult {
  const windowMs = windowSeconds * 1000;
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { limited: true, retryAfterSeconds: Math.ceil((recent[0] + windowMs - now) / 1000), backend: "memory" };
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep memory bounded: drop stale keys occasionally.
  if (hits.size > 5000) {
    for (const [storedKey, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(storedKey);
    }
  }
  return { limited: false, retryAfterSeconds: 0, backend: "memory" };
}

function upstashConfig(): { url: string; token: string } | undefined {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  return url && token ? { url, token } : undefined;
}

/** INCR + EXPIRE NX + TTL in one round trip. Returns undefined on any failure so the caller can fall back. */
async function upstashLimit(
  config: { url: string; token: string },
  key: string,
  { limit, windowSeconds }: RateLimitOptions,
): Promise<RateLimitResult | undefined> {
  try {
    const response = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSeconds), "NX"],
        ["TTL", key],
      ]),
      signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return undefined;
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return undefined;
    const [count, , ttl] = data.map((entry: unknown) =>
      typeof entry === "object" && entry !== null && "result" in entry ? (entry as { result: unknown }).result : undefined,
    );
    if (typeof count !== "number") return undefined;
    const retryAfterSeconds = typeof ttl === "number" && ttl > 0 ? ttl : windowSeconds;
    return { limited: count > limit, retryAfterSeconds: count > limit ? retryAfterSeconds : 0, backend: "upstash" };
  } catch {
    return undefined;
  }
}

export async function rateLimit(ip: string, options: RateLimitOptions, now = Date.now()): Promise<RateLimitResult> {
  const key = `leonida:rl:${options.name}:${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
  const config = upstashConfig();
  if (config) {
    const result = await upstashLimit(config, key, options);
    if (result) return result;
    console.warn("[rate-limit] Upstash unavailable, using the in-memory fallback.");
  }
  return memoryLimit(key, options, now);
}
