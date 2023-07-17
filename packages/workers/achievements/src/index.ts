import { createCors, error, json, Router } from 'itty-router';

import streaksCalendar from './handlers/streaksCalendar';
import streaksList from './handlers/streaksList';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('gm, to achievements service 👋'));
router.get('/streaks/:id', ({ params }, env) =>
  streaksCalendar(params.id, env)
);
router.get('/streaks/:id/:date', ({ params }, env) =>
  streaksList(params.id, params.date, env)
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
