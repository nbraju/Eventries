const CACHE='cloudtento-v1';
const SHELL=['./','./index.html','./manifest.json'];

self.addEventListener('install',e =>
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  )
);

self.addEventListener('activate',e =>
  e.waitUntil(self.clients.claim())
);

self.addEventListener('fetch',e => {
  if(e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;

      return fetch(e.request).then(response => {
        const copy = response.clone();

        caches.open(CACHE).then(cache => {
          cache.put(e.request, copy);
        });

        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
