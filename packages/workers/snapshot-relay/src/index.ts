import { createCors, error, json, Router } from 'itty-router';

import getSnapshotAddress from './handlers/snapshotAddress';
import type { Env } from './types';

const router = Router();

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['POST']
});

router.all('*', preflight);
router.post('/getSnapshotAddress', getSnapshotAddress);

const routerHandleStack = (request: Request, env: Env, ctx: ExecutionContext) =>
  router.handle(request, env, ctx).then(json);

const handleCache = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => {
  const cacheUrl = new URL(request.url);

  if (request.method !== 'POST') {
    return routerHandleStack(request, env, ctx);
  }

  const encodedKey = encodeURIComponent(await request.clone().text());

  if (encodedKey === '') {
    return error(400, 'Bad request, empty body');
  }

  const cacheKey = new Request(cacheUrl.toString() + '/' + encodedKey, {
    ...request,
    method: 'GET',
    body: undefined
  });

  // @ts-ignore
  const cache = caches.default;
  let response = await cache.match(cacheKey);

  if (!response) {
    response = (await routerHandleStack(request, env, ctx)) as Response;
    // response.headers.append('Cache-Control', 's-maxage=30');
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
};

export default {
  fetch: async (request: Request, env: Env, ctx: ExecutionContext) =>
    handleCache(request, env, ctx)
      .catch((error_) => error(500, error_))
      .then(corsify)
};
