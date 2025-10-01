// This is the service worker script, which executes in the background.

// Define a cache name for our app's assets.
const CACHE_NAME = 'saban-chat-v3';

// List of essential files to cache upon installation.
const urlsToCache = [
  './', // The main HTML file (whatsaapp.html or index.html)
  './manifest.json', // The app manifest file
  'https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&display=swap',
  'https://i.postimg.cc/2SbDgD1B/1.png', // App Icon
  'https://i.postimg.cc/D0m2hL1W/sban-bg.png' // Chat Background
];

// 'install' event: Fired when the service worker is first installed.
self.addEventListener('install', event => {
  // We use event.waitUntil to ensure the service worker doesn't move on
  // from the 'install' stage until it's finished caching our core assets.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 'fetch' event: Fired for every network request made by the page.
self.addEventListener('fetch', event => {
  // We use event.respondWith to hijack the request and provide our own response.
  event.respondWith(
    // caches.match() looks for a matching request in the cache.
    caches.match(event.request)
      .then(response => {
        // If a matching response is found in the cache, return it.
        if (response) {
          return response;
        }
        // If no match is found, fetch the request from the network.
        return fetch(event.request);
      }
    )
  );
});

// 'activate' event: Fired when the service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // If a cache is found that's not in our whitelist, delete it.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
