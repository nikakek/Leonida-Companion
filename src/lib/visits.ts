/**
 * First-party visit counting: hourly totals only, nothing per person.
 * Each page view increments counters in one Redis hash per UTC hour (page, country, referrer source, device).
 * No IP address, city, user agent string or identifier is stored.
 * Kept free of "@/..." imports so the Netlify scheduled function can import it by relative path.
 */

const KEY_PREFIX = "leonida:visits:";
/** Hourly hashes are kept for 8 days, then Redis deletes them. */
export const VISIT_TTL_SECONDS = 8 * 24 * 60 * 60;

/** Total page views in the current hour that trigger an instant Telegram alert. */
export const SPIKE_MILESTONES: readonly number[] = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

/**
 * Increments `total` plus every field passed in ARGV (the last ARGV item is the TTL), in one Redis command.
 * Returns the new hourly total.
 */
export const INCREMENT_SCRIPT = `local total = redis.call('HINCRBY', KEYS[1], 'total', 1)
for i = 1, #ARGV - 1 do redis.call('HINCRBY', KEYS[1], ARGV[i], 1) end
redis.call('EXPIRE', KEYS[1], ARGV[#ARGV])
return total`;

/** UTC hour bucket, e.g. "2026111914". */
export function hourBucket(date: Date): string {
  return date.toISOString().slice(0, 13).replace(/[-T]/g, "");
}

export function visitKey(date: Date): string {
  return `${KEY_PREFIX}${hourBucket(date)}`;
}

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch/i;

export function isBot(userAgent: string): boolean {
  return userAgent === "" || BOT_PATTERN.test(userAgent);
}

export type Device = "mobile" | "tablet" | "desktop";

export function deviceFromUserAgent(userAgent: string): Device {
  if (/ipad|tablet|kindle|silk|(android(?!.*mobile))/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)yahoo\./, "yahoo"],
  [/(^|\.)yandex\./, "yandex"],
  [/(^|\.)reddit\.com$/, "reddit"],
  [/(^|\.)(x|twitter)\.com$|^t\.co$/, "x"],
  [/(^|\.)(facebook|fb)\.com$/, "facebook"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)youtube\.com$|^youtu\.be$/, "youtube"],
  [/(^|\.)discord(app)?\.com$/, "discord"],
  [/(^|\.)t\.me$|telegram/, "telegram"],
];

/** Referrer reduced to a source name or bare hostname. Full referrer URLs are never stored. */
export function referrerSource(referrer: string, ownHost: string): string {
  if (referrer === "internal") return "internal";
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (!host) return "direct";
    if (host === ownHost.replace(/^www\./, "")) return "internal";
    return SOURCES.find(([pattern]) => pattern.test(host))?.[1] ?? host.slice(0, 60);
  } catch {
    return "direct";
  }
}

/** Path without query or hash, limited to safe characters. Anything odd is counted as "other". */
export function normalizePath(path: unknown): string {
  if (typeof path !== "string") return "other";
  const clean = path.split(/[?#]/)[0].toLowerCase();
  return /^\/[a-z0-9\-/.]{0,80}$/.test(clean) ? clean.replace(/(.)\/$/, "$1") : "other";
}

/** Two-letter country code from Netlify's geo headers, or "??". Derived by the host; we never see the IP. */
export function countryFromHeaders(headers: Headers): string {
  const direct = headers.get("x-country");
  if (direct && /^[A-Za-z]{2}$/.test(direct)) return direct.toUpperCase();
  const geo = headers.get("x-nf-geo");
  if (geo) {
    try {
      const parsed: unknown = JSON.parse(Buffer.from(geo, "base64").toString("utf8"));
      const code = (parsed as { country?: { code?: unknown } }).country?.code;
      if (typeof code === "string" && /^[A-Za-z]{2}$/.test(code)) return code.toUpperCase();
    } catch {
      // Malformed header: fall through.
    }
  }
  return "??";
}

/** Redis HGETALL result (flat [field, value, ...] array) to a map of numbers. */
export function parseHash(raw: unknown): Map<string, number> {
  const counts = new Map<string, number>();
  if (!Array.isArray(raw)) return counts;
  for (let i = 0; i + 1 < raw.length; i += 2) {
    const value = Number(raw[i + 1]);
    if (typeof raw[i] === "string" && Number.isFinite(value)) counts.set(raw[i], value);
  }
  return counts;
}

function flag(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));
}

function top(counts: Map<string, number>, prefix: string, limit: number): [string, number][] {
  return [...counts]
    .filter(([field]) => field.startsWith(prefix))
    .map(([field, value]): [string, number] => [field.slice(prefix.length), value])
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function percent(value: number, total: number): string {
  return `${Math.round((value / total) * 100)}%`;
}

function hourLabel(start: Date, timeZone: string): string {
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  try {
    const format = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });
    const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" });
    return `${format.format(start)}–${time.format(end)} (${timeZone})`;
  } catch {
    return `${start.toISOString().slice(0, 13).replace("T", " ")}:00 UTC`;
  }
}

/** Plain-text Telegram digest for one hour, or undefined when there were no visits. */
export function formatDigest(counts: Map<string, number>, hourStart: Date, timeZone: string): string | undefined {
  const total = counts.get("total") ?? 0;
  if (total === 0) return undefined;
  const entries = counts.get("entry") ?? 0;
  const section = (title: string, rows: string[]) => (rows.length > 0 ? [`\n${title}`, ...rows] : []);

  return [
    `📊 Leonida Companion · ${hourLabel(hourStart, timeZone)}`,
    `${total} page views · ${entries} visits`,
    ...section(
      "Top pages",
      top(counts, "p:", 6).map(([path, value]) => `${path}  ${value} (${percent(value, total)})`),
    ),
    ...section(
      "Countries",
      [top(counts, "c:", 6).map(([code, value]) => `${flag(code)} ${code} ${percent(value, total)}`).join(" · ")].filter(Boolean),
    ),
    ...section(
      "Sources (visits)",
      [top(counts, "r:", 6).map(([source, value]) => `${source} ${value}`).join(" · ")].filter(Boolean),
    ),
    ...section(
      "Devices",
      [top(counts, "d:", 3).map(([device, value]) => `${device} ${percent(value, total)}`).join(" · ")].filter(Boolean),
    ),
  ].join("\n");
}

export function spikeMessage(total: number, hourStart: Date, timeZone: string): string {
  return `🚀 Traffic spike: ${total} page views so far this hour · ${hourLabel(hourStart, timeZone)}`;
}

/** IANA time zone for digest labels (DIGEST_TIMEZONE), UTC when unset or invalid. */
export function digestTimeZone(): string {
  const zone = process.env.DIGEST_TIMEZONE?.trim();
  if (!zone) return "UTC";
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: zone });
    return zone;
  } catch {
    return "UTC";
  }
}

/** Start of the UTC hour containing `date`. */
export function hourStart(date: Date): Date {
  const start = new Date(date);
  start.setUTCMinutes(0, 0, 0);
  return start;
}
