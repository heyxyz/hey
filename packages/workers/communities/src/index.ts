import { createCors, error, json, Router } from 'itty-router';

import createCommunity from './handlers/createCommunity';
import getCommunities from './handlers/getCommunities';
import getCommunity from './handlers/getCommunity';
import getMembers from './handlers/getMembers';
import isMember from './handlers/isMember';
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
router.get('/:slug', ({ params }, env) => getCommunity(params.slug, env));
router.get('/get/:profileId/:offset', ({ params }, env) =>
  getCommunities(params.profileId, params.offset, env)
);
router.get('/members/:communityId/:offset', ({ params }, env) =>
  getMembers(params.communityId, params.offset, env)
);
router.get('/isMember/:communityId/:profileId', ({ params }, env) =>
  isMember(params.communityId, params.profileId, env)
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
