import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import getHeyMemberNftStatus from './handlers/getHeyMemberNftStatus';
import getPreferences from './handlers/getPreferences';
import getVerified from './handlers/getVerified';
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
  .get('/get/:id', getPreferences)
  .get('/getHeyMemberNftStatus/:id', getHeyMemberNftStatus)
  .get('/verified', getVerified)
  .post('/update', updatePreferences)
  .post('/updateHeyMemberNftStatus', updateHeyMemberNftStatus)
  .post('/staffMode', updateStaffMode)
  .post('/gardenerMode', updateGardenerMode)
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
