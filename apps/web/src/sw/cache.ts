/**
 * NOTE - Remember to increment version upon adding/updating any static assets inside the /public folder or whenever new pages introduced
 */
const CACHE_VERSION = process.env.LATEST_GIT_COMMIT_SHA;
export class ServiceWorkerCache {
  cacheName: string;
  cachePrefix: string;
  staticAssets: Set<string>;
  cacheableRoutes: Set<string>;
  withQueryParams?: boolean;

  constructor({
    cachePrefix,
    staticAssets,
    cacheableRoutes,
    withQueryParams
  }: {
    cachePrefix: string;
    iconsCachePrefix?: string;
    staticAssets: string[];
    cacheableRoutes: string[];
    cacheableIconDomains?: string[];
    withQueryParams?: boolean;
  }) {
    this.cachePrefix = cachePrefix;
    this.cacheName = `${cachePrefix}_${CACHE_VERSION}`;
    this.staticAssets = new Set(staticAssets);
    this.cacheableRoutes = new Set(cacheableRoutes);
    this.withQueryParams = withQueryParams ?? true;
  }

  private readonly cacheStaticAsset = (pathname: string, cache: Cache) => {
    fetch(pathname)
      .then((response) => {
        if ([200, 304].includes(response.status)) {
          cache.put(pathname, response).catch((error) => {
            console.debug(`Failed to cache file - ${pathname}`, error);
            console.debug(`Failed to cache file - ${pathname}`, error);
          });
        } else {
          throw new Error('Failed to fetch from local');
        }
      })
      .catch(console.debug);
  };

  cacheStaticAssets = async () => {
    const cache = await caches.open(this.cacheName);

    for (const pathname of this.staticAssets) {
      this.cacheStaticAsset(pathname, cache);
    }
  };

  invalidatePreviousCache = async () => {
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith(this.cachePrefix))
        .map(async (cacheName) => {
          if (cacheName !== this.cacheName) {
            return await caches.delete(cacheName);
          }
          return await Promise.resolve(false);
        })
    );
  };

  private readonly put = async (pathname: string, cache: Cache) => {
    const response = await fetch(pathname, {
      cache: 'reload'
    });
    const isValidResponse =
      !response.redirected && [200, 304].includes(response.status);

    if (isValidResponse) {
      await cache.put(pathname, response);
    } else {
      await cache.delete(pathname);
    }
  };

  get = async (event: FetchEvent) => {
    const { request } = event;
    const { pathname, search } = new URL(request.url);
    const uniquePath = `${pathname}${this.withQueryParams ? search : ''}`;

    if (
      (this.staticAssets.has(pathname) || this.cacheableRoutes.has(pathname)) &&
      this.cacheName
    ) {
      const cache = await caches.open(this.cacheName);
      const cachedResponse = await cache.match(uniquePath);

      if (navigator.onLine) {
        event.waitUntil(this.put(uniquePath, cache));
      }

      if (cachedResponse) {
        return cachedResponse;
      }
    }
    return await fetch(request);
  };
}
