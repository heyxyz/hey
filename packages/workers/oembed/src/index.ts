import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';
import { createCors, error, Router, status } from 'itty-router';
import { Toucan } from 'toucan-js';

import getImage from './handlers/getImage';
import getOembed from './handlers/getOembed';
import buildRequest from './helper/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET']
});

const router = Router();

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to oembed service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/oembed', getOembed)
  .get('/image', getImage);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const sentry = new Toucan({
      request,
      context: ctx,
      tracesSampleRate: 1.0,
      dsn: env.SENTRY_DSN,
      release: env.RELEASE
    });
    const incomingRequest = buildRequest(request, env, ctx, sentry);

    return await router
      .handle(incomingRequest)
      .then(corsify)
      .catch((error_) => {
        sentry.captureException(error_);
        return error(500, Errors.InternalServerError);
      });
  }
};
