/* Accordo — service worker : cache hors-ligne minimal */
const CACHE = "accordo-v15";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./i18n.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./legal.html",
  "./legal.js",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
