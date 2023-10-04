import type { IRequestStrict } from 'itty-router';

export interface Env {
  RELEASE: string;
  LIVEPEER_API_KEY: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
} & IRequestStrict;
