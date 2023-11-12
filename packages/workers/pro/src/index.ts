import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import getProEnabled from './handlers/getProEnabled';
import recycleProProfiles from './handlers/recycleProProfiles';
import buildRequest from './helpers/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to pro service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/getProEnabled', getProEnabled)
  .delete('/recycleProProfiles', recycleProProfiles)
  .all('*', () => error(404));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const incomingRequest = buildRequest(request, env, ctx);

    return await router
      .handle(incomingRequest)
      .then(corsify)
      .catch(() => {
        return error(500, Errors.InternalServerError);
      });
  }
};
