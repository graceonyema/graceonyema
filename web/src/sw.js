const staticCacheName = 'site-static-v440';
const filesToCache = [
  '/',
  '/about',
  '/services',
  '/contact',
  '/styles/bootstrap.min.css',
  '/styles/index.min.css',
  '/scripts/index.min.js',
  '/favicon.ico',
  '/assets/icons/logo2.png',
  '/assets/icons/diagonals1.svg',
  '/assets/icons/diagonals2.svg',
  '/assets/images/grace_onyema_1_pic-400.jpg',
  '/assets/images/grace_onyema_1_pic-400-2x.jpg',
  '/assets/images/grace_onyema_1_pic-500.jpg',
  '/assets/images/grace_onyema_1_pic-500-2x.jpg',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
];


/*
 *   Install service worker and cache essential files 
 */

self.addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open(staticCacheName);
    // console.log('caching essential files');
    // return cache.addAll(filesToCache);
    await cache.addAll(filesToCache);
  }());
});


/*
 *   Activate service worker and delete old cache 
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(async function() {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.filter((cacheName) => {
        return cacheName.startsWith('site-static-') && cacheName !== staticCacheName;
      }).map(cacheName => {
        console.log('deleting old cache:', cacheName);
        caches.delete(cacheName)
      })
    );
  }());
});


/**  Activate Service Worker immediately  **/
self.skipWaiting();


/*   
 *   Fetch resources from cache or get from network if unavailable in cache then save a copy of response for future  
 */
self.addEventListener('fetch', (event) => {
  // console.log("intercepting: ", event);
  event.respondWith(async function() {
    const cache = await caches.open(staticCacheName);
    const cachedResponse = await cache.match(event.request);
    const networkResponsePromise = fetch(event.request);

    event.waitUntil(async function() {
      const networkResponse = await networkResponsePromise;
      await cache.put(event.request, networkResponse.clone());
    }());

    // Returned the cached response if we have one, otherwise return the network response.
    return cachedResponse || networkResponsePromise;
  }());
});