import { createCors, error, json, Router } from 'itty-router';

import getOembed from './handlers/getOembed';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET']
});

const router = Router();

router.all('*', preflight);
router.get('/', getOembed);

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
