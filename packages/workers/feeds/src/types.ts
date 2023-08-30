import type { IRequestStrict } from 'itty-router';
import type { Toucan } from 'toucan-js';

export interface Env {
  SENTRY_DSN: string;
  RELEASE: string;
  CLICKHOUSE_REST_ENDPOINT: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  sentry?: Toucan;
} & IRequestStrict;
