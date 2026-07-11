const STATIC_CACHE = 'silver-health-static-v4';
const PAGE_CACHE = 'silver-health-pages-v4';
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
const NETWORK_TIMEOUT_MS = 3000;

function fetchWithTimeout(request) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT_MS);
  });

  return Promise.race([fetch(request), timeout]).finally(() => clearTimeout(timeoutId));
}

async function fetchAndCachePage(request, pathname) {
  const response = await fetchWithTimeout(request);
  const responsePath = new URL(response.url).pathname;
  if (response.ok && CACHEABLE_PAGES.has(pathname) && responsePath === pathname) {
    const cache = await caches.open(PAGE_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function fetchAndCacheTabData(request) {
  const response = await fetchWithTimeout(request);
  if (response.ok) {
    const cache = await caches.open(PAGE_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

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

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith((async () => {
      const cached = CACHEABLE_PAGES.has(url.pathname)
        ? await caches.match(request, { ignoreSearch: true })
        : undefined;
      if (cached) {
        event.waitUntil?.(fetchAndCachePage(request, url.pathname).catch(() => undefined));
        return cached;
      }

      try {
        return await fetchAndCachePage(request, url.pathname);
      } catch {
        return await caches.match(request, { ignoreSearch: true })
          || await caches.match('/offline.html')
          || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetchWithTimeout(request);
        if (response.ok) {
          const cache = await caches.open(STATIC_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return new Response('', { status: 504 });
      }
    })());
    return;
  }

  if (STATIC_PATHS.has(url.pathname) && !url.searchParams.has('_rsc')) {
    event.respondWith(caches.match(request).then(async (cached) => {
      if (cached) return cached;
      try {
        const response = await fetchWithTimeout(request);
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
      const cached = await caches.match(request);
      if (cached) {
        event.waitUntil?.(fetchAndCacheTabData(request).catch(() => undefined));
        return cached;
      }

      try {
        return await fetchAndCacheTabData(request);
      } catch {
        return new Response('', { status: 504 });
      }
    })());
  }
});
