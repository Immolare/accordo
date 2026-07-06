/* Accordo — service worker : cache hors-ligne minimal */
const CACHE = "accordo-v17";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./js/i18n.js",
  "./js/music.js",
  "./js/share-code.js",
  "./js/settings-store.js",
  "./js/audio-engine.js",
  "./js/ui.js",
  "./js/custom-tunings.js",
  "./js/app.js",
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
