import { createCors, error, json, Router } from 'itty-router';

import getCommunities from './handlers/get/getCommunities';
import getCommunity from './handlers/get/getCommunity';
import getCommunityIds from './handlers/get/getCommunityIds';
import getIsMember from './handlers/get/getIsMember';
import getMembers from './handlers/get/getMembers';
import createOrUpdateCommunity from './handlers/post/community/createOrUpdate';
import joinOrLeave from './handlers/post/community/joinOrLeave';
import createOrUpdateRules from './handlers/post/rule/createOrUpdate';
import staffPick from './handlers/post/staff/staffPick';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('gm, to communities service 👋'));

// POST
// Community
router.post('/community/createOrUpdate', createOrUpdateCommunity);
router.post('/community/joinOrLeave', joinOrLeave);

// Rule
router.post('/rule/createOrUpdate', createOrUpdateRules);

// Staff
router.post('/staff/pick', staffPick);

// GET
router.get('/getCommunityById/:identifier', ({ params }, env) =>
  getCommunity(params.identifier, 'id', env)
);
router.get('/getCommunityBySlug/:identifier', ({ params }, env) =>
  getCommunity(params.identifier, 'slug', env)
);
router.get('/getCommunities/:profileId/:offset', ({ params }, env) =>
  getCommunities(params.profileId, params.offset, env)
);
router.get('/getCommunityIds/:profileId', ({ params }, env) =>
  getCommunityIds(params.profileId, env)
);
router.get('/getMembers/:communityId/:offset', ({ params }, env) =>
  getMembers(params.communityId, params.offset, env)
);
router.get('/getIsMember/:communityId/:profileId', ({ params }, env) =>
  getIsMember(params.communityId, params.profileId, env)
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
