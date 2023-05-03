import { createCors, error, Router } from 'itty-router';

import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['POST']
});

const router = Router();

router.all('*', preflight);

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) =>
    router
      .handle(request, env, context)
      .then(corsify)
      .catch((error_) => error(500, error_))
};
