import { createCors, error, json, Router } from 'itty-router';

import getPreferences from './handlers/getPreferences';
import getVerified from './handlers/getVerified';
import updateGardenerMode from './handlers/updateGardenerMode';
import updatePreferences from './handlers/updatePreferences';
import updateStaffMode from './handlers/updateStaffMode';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('gm, to preferences service 👋'));
router.get('/get/:id', ({ params }, env) => getPreferences(params.id, env));
router.post('/update', updatePreferences);
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
