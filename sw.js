// RA10 Service Worker — network-first, passthrough
const CACHE_NAME = 'ra10-v2';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Network-first: always try network, fall back to cache for same-origin GET requests
self.addEventListener('fetch', function(e) {
  // Only handle GET requests for same-origin resources
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request).then(function(response) {
      // Cache successful same-origin responses
      if (response && response.status === 200) {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, cloned);
        });
      }
      return response;
    }).catch(function() {
      // Network failed — try cache
      return caches.match(e.request);
    })
  );
});
