// Lets Chrome install the app. Pages always load fresh from the network (so updates show at once);
// the last copy is kept only to open the app when there is no connection.
const CACHE = 'pcm-shell-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.mode !== 'navigate') return;   // everything else (data, photos) goes straight to the network
  e.respondWith((async () => {
    try {
      const res = await fetch(req, {cache: 'no-store'});
      if (res && res.ok) { const c = await caches.open(CACHE); c.put('./', res.clone()); }
      return res;
    } catch (err) {
      const c = await caches.open(CACHE), hit = await c.match('./');
      return hit || Response.error();
    }
  })());
});
