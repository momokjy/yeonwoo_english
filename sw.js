// Offline support. Network first (so updates arrive right away),
// falling back to the cache when there is no internet.

// Each app on the same GitHub Pages site needs its own cache prefix.
const PREFIX = 'yeonwoo-english-';
const CACHE = PREFIX + 'v3';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'assets/icon.svg',
  'assets/icon-180.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'js/main.js',
  'js/characters.js',
  'js/core/util.js',
  'js/core/store.js',
  'js/core/speech.js',
  'js/core/sfx.js',
  'js/core/mic.js',
  'js/core/ui.js',
  'js/core/drag.js',
  'js/core/nav.js',
  'js/core/cancel.js',
  'js/content/vocab.js',
  'js/content/units.js',
  'js/screens/home.js',
  'js/screens/play.js',
  'js/screens/parent.js',
  'js/activities/index.js',
  'js/activities/learn.js',
  'js/activities/listen.js',
  'js/activities/drag.js',
  'js/activities/touch.js',
  'js/activities/scrub.js',
  'js/activities/count.js',
  'js/activities/say.js',
  'js/activities/talk.js',
  'js/activities/move.js',
  'js/activities/balloons.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !isFont) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
  );
});
