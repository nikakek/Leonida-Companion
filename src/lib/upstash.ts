/**
 * Minimal Upstash Redis REST client (no SDK). Server-only.
 * Kept free of "@/..." imports so the Netlify scheduled function can import it by relative path.
 */

export interface UpstashConfig {
  url: string;
  token: string;
}

const TIMEOUT_MS = 2000;

export function upstashConfig(): UpstashConfig | undefined {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  return url && token ? { url, token } : undefined;
}

/** Runs several commands in one round trip. Returns each command's `result`, or undefined on any failure. */
export async function upstashPipeline(config: UpstashConfig, commands: (string | number)[][]): Promise<unknown[] | undefined> {
  try {
    const response = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands.map((command) => command.map(String))),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return undefined;
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return undefined;
    return data.map((entry: unknown) =>
      typeof entry === "object" && entry !== null && "result" in entry ? (entry as { result: unknown }).result : undefined,
    );
  } catch {
    return undefined;
  }
}
