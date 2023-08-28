import type { IRequestStrict } from 'itty-router';
import type { Toucan } from 'toucan-js';

export interface Env {
  SENTRY_DSN: string;
  RELEASE: string;
  BUNDLR_PRIVATE_KEY: string;
  HUGGINGFACE_API_KEY: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  sentry?: Toucan;
} & IRequestStrict;
