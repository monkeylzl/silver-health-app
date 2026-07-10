const STATIC_CACHE = 'silver-health-static-v3';
const PAGE_CACHE = 'silver-health-pages-v3';
const STATIC_ASSETS = [
  '/access',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];
const CACHEABLE_PAGES = new Set(['/', '/health', '/family', '/me', '/tasks', '/family/reports']);
const STATIC_PATHS = new Set(STATIC_ASSETS);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE).map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'CLEAR_APP_CACHE') {
    event.waitUntil(caches.delete(PAGE_CACHE));
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const responsePath = new URL(response.url).pathname;
        if (response.ok && CACHEABLE_PAGES.has(url.pathname) && responsePath === url.pathname) {
          const cache = await caches.open(PAGE_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return await caches.match(request, { ignoreSearch: true })
          || await caches.match('/offline.html')
          || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (STATIC_PATHS.has(url.pathname) && !url.searchParams.has('_rsc')) {
    event.respondWith(caches.match(request).then(async (cached) => {
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(STATIC_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return new Response('', { status: 504 });
      }
    }));
    return;
  }

  if (url.searchParams.has('_rsc') && CACHEABLE_PAGES.has(url.pathname)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(PAGE_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return await caches.match(request) || new Response('', { status: 504 });
      }
    })());
  }
});
