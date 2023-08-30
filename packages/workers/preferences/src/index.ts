import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';
import { createCors, error, Router, status } from 'itty-router';
import { Toucan } from 'toucan-js';

import getPreferences from './handlers/getPreferences';
import getVerified from './handlers/getVerified';
import updateGardenerMode from './handlers/updateGardenerMode';
import updatePreferences from './handlers/updatePreferences';
import updateStaffMode from './handlers/updateStaffMode';
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
      message: 'gm, to preferences service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/get/:id', getPreferences)
  .post('/update', updatePreferences)
  .get('/verified', getVerified)
  .post('/staffMode', updateStaffMode)
  .post('/gardenerMode', updateGardenerMode)
  .all('*', () => error(404));

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
      release: env.RELEASE,
      requestDataOptions: { allowedIps: true }
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
