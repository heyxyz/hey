import type { Env, WorkerRequest } from '../types';

const buildRequest = (
  request: Request,
  env: Env,
  ctx: ExecutionContext
): WorkerRequest => {
  const temp: WorkerRequest = request as WorkerRequest;
  temp.req = request;
  temp.env = env;
  temp.ctx = ctx;

  return temp;
};

export default buildRequest;
