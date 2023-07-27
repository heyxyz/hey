import { createCors, error, json, Router } from 'itty-router';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('gm, to community service 👋'));

const routerHandleStack = (request: Request, ctx: ExecutionContext) =>
  router.handle(request, ctx).then(json);

const handleFetch = async (request: Request, ctx: ExecutionContext) => {
  try {
    return await routerHandleStack(request, ctx);
  } catch {
    return error(500);
  }
};

export default {
  fetch: (request: Request, context: ExecutionContext) =>
    handleFetch(request, context).then(corsify)
};
