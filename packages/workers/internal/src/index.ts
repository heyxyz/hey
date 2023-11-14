import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import validateLensAccount from '@hey/lib/worker-middlewares/validateLensAccount';
import { createCors, error, Router, status } from 'itty-router';

import downgradeProProfiles from './handlers/downgradeProProfiles';
import getAllFeatureFlags from './handlers/getAllFeatureFlags';
import updateFeatureFlag from './handlers/updateFeatureFlag';
import updateGardenerMode from './handlers/updateGardenerMode';
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
      message: 'gm, to internal service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/getAllFeatureFlags', getAllFeatureFlags)
  .post('/updateStaffMode', validateLensAccount, updateStaffMode)
  .post('/updateGardenerMode', validateLensAccount, updateGardenerMode)
  .post('/updateFeatureFlag', validateLensAccount, updateFeatureFlag)
  .delete('/downgradeProProfiles', downgradeProProfiles)
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
