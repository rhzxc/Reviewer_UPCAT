// This file runs in the background, separately from your webpage.
// Its job: save copies of your site's files so the app still works with no internet.

const CACHE_NAME = 'upcat-reviewer-v6';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// "install" runs once, when the browser first discovers this service worker.
// We use it to download and store every file listed above.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// "activate" cleans up old cache versions if we ever ship a v2.
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// "fetch" intercepts every request the page makes (like loading style.css).
// We answer from the offline cache first; only go to the network if it's
// not cached yet.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request);
    })
  );
});
