import { createCors, error, json, Router } from 'itty-router';

import createPoll from './handlers/createPoll';
import getProposal from './handlers/getProposal';
import getSpaceId from './handlers/getSpaceId';
import votePoll from './handlers/votePoll';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('Snapshot Relay'));
router.get('/getProposal/:network/:id/:voter', ({ params }) =>
  getProposal(params.network, params.id, params.voter)
);
router.get('/getSpaceId/:network/:id', ({ params }) =>
  getSpaceId(params.network, params.id)
);
router.post('/createPoll', createPoll);
router.post('/votePoll', votePoll);

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
