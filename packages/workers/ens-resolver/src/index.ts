import { createCors, error, json, Router } from 'itty-router';

import resolveEns from './handlers/resolveEns';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('say gm to ens resolver service 👋'));
router.post('/', resolveEns);

const routerHandleStack = (request: Request, ctx: ExecutionContext) =>
  router.handle(request, ctx).then(json);

const handleFetch = async (request: Request, ctx: ExecutionContext) => {
  try {
    return await routerHandleStack(request, ctx);
  } catch (error_) {
    console.error('Failed to handle request', error_);
    return error(500);
  }
};

export default {
  fetch: (request: Request, context: ExecutionContext) =>
    handleFetch(request, context).then(corsify)
};
