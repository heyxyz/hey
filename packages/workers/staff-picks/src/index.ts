import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import addPick from './handlers/addPick';
import getStaffPick from './handlers/getStaffPick';
import getStaffPicks from './handlers/getStaffPicks';
import removePick from './handlers/removePick';
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
      message: 'gm, to staff-picks service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/get/:id', getStaffPick)
  .get('/all', getStaffPicks)
  .post('/addPick', addPick)
  .post('/removePick', removePick)
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
