import type { IRequestStrict } from 'itty-router';

export interface Env {
  RELEASE: string;
  SHARED_LENS_INVITE_SECRET: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
} & IRequestStrict;
