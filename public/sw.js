/* Leonida Companion service worker.
 * Data changes often after launch, so:
 *  - network-first for HTML, RSC payloads and everything else same-origin (fresh when online),
 *  - cache-first ONLY for immutable, content-hashed /_next/static/* assets,
 *  - offline fallback page when a navigation fails and nothing is cached.
 * The offline fallback is a static, self-contained HTML file (no JS chunks to miss).
 * Bump CACHE_VERSION whenever this file's caching logic changes.
 */
const CACHE_VERSION = "v1";
const STATIC_CACHE = `leonida-static-${CACHE_VERSION}`;
const PAGES_CACHE = `leonida-pages-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";
// Router prefetches (?_rsc=...) add many small entries; keep the page cache bounded.
const MAX_PAGE_ENTRIES = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([STATIC_CACHE, PAGES_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function trimPages(cache) {
  const keys = await cache.keys();
  const offline = new URL(OFFLINE_URL, self.location.origin).href;
  const removable = keys.filter((key) => key.url !== offline);
  const excess = removable.length - MAX_PAGE_ENTRIES;
  // Cache keys are in insertion order, so the oldest entries go first.
  for (let i = 0; i < excess; i++) await cache.delete(removable[i]);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(PAGES_CACHE);
      await cache.delete(request);
      await cache.put(request, response.clone());
      trimPages(cache);
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const offline = await caches.match(OFFLINE_URL);
      if (offline) return offline;
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});
