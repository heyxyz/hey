import { createCors, error, Router } from 'itty-router';

import createPoll from './handlers/createPoll';
import votePoll from './handlers/votePoll';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('Snapshot Relay'));
router.post('/createPoll', createPoll);
router.post('/votePoll', votePoll);

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) =>
    router
      .handle(request, env, context)
      .then(corsify)
      .catch((error_) => error(500, error_))
};
