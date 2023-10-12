import { ServiceWorkerCache } from './cache';

declare let self: ServiceWorkerGlobalScope;

const preCachedAssets = (process.env.STATIC_ASSETS ?? []) as string[];
const CACHEABLE_PATHS = ['/', '/contact', '/explore'];
const CACHEABLE_DOMAINS = ['https://static-assets.hey.xyz'];

const cache = new ServiceWorkerCache({
  cachePrefix: 'SWCache',
  cacheableRoutes: [...CACHEABLE_PATHS, ...CACHEABLE_DOMAINS],
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

  if (self.location.origin === origin || CACHEABLE_DOMAINS.includes(origin)) {
    event.respondWith(cache.get(event));
  }
  return;
};

self.addEventListener('fetch', handleFetch);
self.addEventListener('install', (event) => event.waitUntil(handleInstall()));
self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
