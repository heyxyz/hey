import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import featuredChannels from './handlers/featuredChannels';
import getChannel from './handlers/getChannel';
import isMember from './handlers/isMember';
import joinOrLeave from './handlers/joinOrLeave';
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
      message: 'gm, to channels service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/get/:slug', getChannel)
  .get('/featured', featuredChannels)
  .get('/isMember', isMember)
  .post('/joinOrLeave', joinOrLeave)
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
