import type { Toucan } from 'toucan-js';

import type { Env, WorkerRequest } from '../types';

const buildRequest = (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  sentry?: Toucan
): WorkerRequest => {
  const temp: WorkerRequest = request as WorkerRequest;
  temp.req = request;
  temp.env = env;
  temp.ctx = ctx;
  temp.sentry = sentry;

  return temp;
};

export default buildRequest;
