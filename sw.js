// Housewright offline support. Version d0585c50a9
const CACHE = 'housewright-d0585c50a9';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k != CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// The app page: newest from the network when online, the saved copy when offline.
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method != 'GET' || u.origin != location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
