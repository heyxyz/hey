import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import validateLensAccount from '@hey/lib/worker-middlewares/validateLensAccount';
import { createCors, error, Router, status } from 'itty-router';

import getAllFeatureFlags from './handlers/features/getAllFeatureFlags';
import updateFeatureFlag from './handlers/features/updateFeatureFlag';
import updateGardenerMode from './handlers/features/updateGardenerMode';
import updateStaffMode from './handlers/features/updateStaffMode';
import downgradeProfiles from './handlers/pro/downgradeProfiles';
import updateVerified from './handlers/verified/updateVerified';
import buildRequest from './helpers/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

// Feature routes
const featureRoutes = Router({ base: '/feature' });
featureRoutes
  .get('/getAllFeatureFlags', getAllFeatureFlags)
  .post('/updateStaffMode', validateLensAccount, updateStaffMode)
  .post('/updateGardenerMode', validateLensAccount, updateGardenerMode)
  .post('/updateFeatureFlag', validateLensAccount, updateFeatureFlag);

// Pro routes
const proRoutes = Router({ base: '/pro' });
proRoutes.delete('/downgradeProfiles', downgradeProfiles);

// Verified routes
const verifiedRoutes = Router({ base: '/verified' });
proRoutes.post('/updateVerified', validateLensAccount, updateVerified);

// Main router
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
  .all('/feature/*', featureRoutes.handle)
  .all('/pro/*', proRoutes.handle)
  .all('/verified/*', verifiedRoutes.handle)
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
