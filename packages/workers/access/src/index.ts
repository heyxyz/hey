import { createCors, error, json, Router } from 'itty-router';

import getAccess from './handlers/getAccess';
import getVerified from './handlers/getVerified';
import updateAccess from './handlers/updateAccess';
import updateGardenerMode from './handlers/updateGardenerMode';
import updateStaffMode from './handlers/updateStaffMode';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('gm, to access service 👋'));
router.get('/rights/:id', ({ params }, env) => getAccess(params.id, env));
router.post('/rights', updateAccess);
router.get('/verified', getVerified);
router.post('/staffMode', updateStaffMode);
router.post('/gardenerMode', updateGardenerMode);

const routerHandleStack = (request: Request, env: Env, ctx: ExecutionContext) =>
  router.handle(request, env, ctx).then(json);

const handleFetch = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => {
  try {
    return await routerHandleStack(request, env, ctx);
  } catch {
    return error(500);
  }
};

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) =>
    handleFetch(request, env, context).then(corsify)
};
