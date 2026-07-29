const CACHE_NAME = "tic-tac-know-v2";
const FILES_TO_CACHE = ["./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Network-first for the page itself, so updates always show up immediately.
  if (e.request.mode === "navigate" || e.request.url.endsWith(".html")) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first for static assets (icons, manifest) — fine for these to be stable.
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
