declare let self: ServiceWorkerGlobalScope;

const CACHE_NAME_PREFIX = '_hey_cache';
// @ts-ignore
const CACHE_VERSION = `v${SW_UNQIUE_BUILD_ID}`;
const CACHE_NAME = `${CACHE_NAME_PREFIX}_${CACHE_VERSION}`;

const impressionsEndpoint = 'https://api.hey.xyz/leafwatch/impressions';
const publicationsVisibilityInterval = 5000;
let viewerId: string | null = null;
const visiblePublicationsSet = new Set();

const sendVisiblePublicationsToServer = () => {
  const publicationsToSend = Array.from(visiblePublicationsSet);

  if (publicationsToSend.length > 0 && viewerId) {
    visiblePublicationsSet.clear();
    fetch(impressionsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        viewer_id: viewerId,
        ids: publicationsToSend
      }),
      keepalive: true
    });
  }
};

setInterval(sendVisiblePublicationsToServer, publicationsVisibilityInterval);

const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
};

self.addEventListener('message', (event) => {
  // Impression tracking
  if (event.data && event.data.type === 'PUBLICATION_VISIBLE') {
    visiblePublicationsSet.add(event.data.id);
    viewerId = event.data.viewerId;
  }
});

self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Clone the request because it's a stream and can only be consumed once
      const fetchRequest = event.request.clone();
      // Cache hit - return the response from the cache
      if (response) {
        return response;
      }
      return fetch(fetchRequest).then((fetchResponse) => {
        // Check if we received a valid response
        if (
          !fetchResponse ||
          fetchResponse.status !== 200 ||
          fetchResponse.type !== 'basic'
        ) {
          return fetchResponse;
        }
        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = fetchResponse.clone();
        // Cache everything that has the header immutable in it
        if (fetchResponse.headers.get('Cache-Control')?.includes('immutable')) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse);
          });
        }
        return responseToCache;
      });
    })
  );
});

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
});

export {};
