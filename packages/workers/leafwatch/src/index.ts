import '@sentry/tracing';

import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';
import { createCors, error, Router } from 'itty-router';
import { Toucan } from 'toucan-js';

import ingest from './handlers/ingest';
import buildRequest from './helpers/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router
  .all('*', preflight)
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to leafwatch service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .post('/ingest', ingest)
  .all('*', () => error(404));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    let transaction: any;
    const sentry = new Toucan({
      request,
      context: ctx,
      tracesSampleRate: 1.0,
      dsn: env.SENTRY_DSN,
      release: env.RELEASE
    });

    if (request.method !== 'OPTIONS') {
      transaction = sentry.startTransaction({
        name: '@lenster/leafwatch/ingest'
      });
    }

    const incomingRequest = buildRequest(request, env, ctx, sentry);

    return await router
      .handle(incomingRequest)
      .then(corsify)
      .catch((error_) => {
        sentry.captureException(error_);
        return error(500, Errors.InternalServerError);
      })
      .finally(() => transaction?.finish());
  }
};
