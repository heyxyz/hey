import type { IRequestStrict } from 'itty-router';

export interface Env {
  RELEASE: string;
  WORKER_ENV: string;
  IMAGEKIT_URL: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
} & IRequestStrict;
