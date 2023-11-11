import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import validateIsGardener from '@hey/lib/worker-middlewares/validateIsGardener';
import validateIsStaff from '@hey/lib/worker-middlewares/validateIsStaff';
import validateLensAccount from '@hey/lib/worker-middlewares/validateLensAccount';
import { createCors, error, Router, status } from 'itty-router';

import getAllFeatureFlags from './handlers/getAllFeatureFlags';
import getFeatureFlags from './handlers/getFeatureFlags';
import getHeyMemberNftStatus from './handlers/getHeyMemberNftStatus';
import getIsGardener from './handlers/getIsGardener';
import getIsStaff from './handlers/getIsStaff';
import getPreferences from './handlers/getPreferences';
import getVerified from './handlers/getVerified';
import updateFeatureFlag from './handlers/updateFeatureFlag';
import updateGardenerMode from './handlers/updateGardenerMode';
import updateHeyMemberNftStatus from './handlers/updateHeyMemberNftStatus';
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
  .get('/getPreferences', getPreferences)
  .get('/getFeatureFlags', getFeatureFlags)
  .get('/getAllFeatureFlags', getAllFeatureFlags)
  .get('/getHeyMemberNftStatus', getHeyMemberNftStatus)
  .get('/getIsStaff', getIsStaff)
  .get('/getIsGardener', getIsGardener)
  .get('/verified', getVerified)
  .post('/updatePreferences', validateLensAccount, updatePreferences)
  .post(
    '/updateHeyMemberNftStatus',
    validateLensAccount,
    updateHeyMemberNftStatus
  )
  .post(
    '/updateStaffMode',
    validateLensAccount,
    validateIsStaff,
    updateStaffMode
  )
  .post(
    '/updateGardenerMode',
    validateLensAccount,
    validateIsGardener,
    updateGardenerMode
  )
  .post(
    '/updateFeatureFlag',
    validateLensAccount,
    validateIsStaff,
    updateFeatureFlag
  )
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
