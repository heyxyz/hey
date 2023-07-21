import { createCors, error, json, Router } from 'itty-router';

import createCommunity from './handlers/createCommunity';
import getCommunity from './handlers/getCommunity';
import getMembers from './handlers/getMembers';
import joinOrLeaveCommunity from './handlers/joinOrLeaveCommunity';
import updateCommunity from './handlers/updateCommunity';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('gm, to communities service 👋'));
router.post('/create', createCommunity);
router.post('/update', updateCommunity);
router.post('/joinOrLeave', joinOrLeaveCommunity);
router.get('/communities/:slug', ({ params }, env) =>
  getCommunity(params.slug, env)
);
router.get('/communities/:slug/members/:offset', ({ params }, env) =>
  getMembers(params.slug, params.offset, env)
);

const routerHandleStack = (request: Request, env: Env, ctx: ExecutionContext) =>
  router.handle(request, env, ctx).then(json);

const handleFetch = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => {
  try {
    return await routerHandleStack(request, env, ctx);
  } catch (error_) {
    console.error('Failed to handle request', error_);
    return error(500);
  }
};

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) =>
    handleFetch(request, env, context).then(corsify)
};
