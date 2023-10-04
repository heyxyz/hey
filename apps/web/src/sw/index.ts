import { ServiceWorkerCache } from './cache';

declare let self: ServiceWorkerGlobalScope;

const preCachedAssets = (process.env.STATIC_ASSETS ?? []) as string[];
const cacheableRoutes = ['/', '/explore', '/contact'];

const cache = new ServiceWorkerCache({
  cachePrefix: 'SWCache',
  cacheableRoutes,
  staticAssets: preCachedAssets
});

async function handleInstall(): Promise<void> {
  void self.skipWaiting();
  await cache.cacheStaticAssets();
}

const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
  await cache.invalidatePreviousCache();
};

const handleFetch = (event: FetchEvent): void => {
  const request = event.request.clone();
  const { origin } = new URL(request.url);

  if (self.location.origin === origin) {
    // responding for same origin requests - assets, documents
    event.respondWith(cache.get(event));
    // can respond to api calls to cache using indexedDB
    // ...
  } else {
    // can further cache third-party api calls, if not needed just do a return - where network will take care the request
    return;
  }
};

self.addEventListener('fetch', handleFetch);
self.addEventListener('install', (event) => event.waitUntil(handleInstall()));
self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
