import { createHash } from "node:crypto";
import { upstashConfig, upstashPipeline, type UpstashConfig } from "@/lib/upstash";

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

/** INCR + EXPIRE NX + TTL in one round trip. Returns undefined on any failure so the caller can fall back. */
async function upstashLimit(
  config: UpstashConfig,
  key: string,
  { limit, windowSeconds }: RateLimitOptions,
): Promise<RateLimitResult | undefined> {
  const results = await upstashPipeline(config, [
    ["INCR", key],
    ["EXPIRE", key, windowSeconds, "NX"],
    ["TTL", key],
  ]);
  if (!results) return undefined;
  const [count, , ttl] = results;
  if (typeof count !== "number") return undefined;
  const retryAfterSeconds = typeof ttl === "number" && ttl > 0 ? ttl : windowSeconds;
  return { limited: count > limit, retryAfterSeconds: count > limit ? retryAfterSeconds : 0, backend: "upstash" };
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
