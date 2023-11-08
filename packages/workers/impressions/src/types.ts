import type { IRequestStrict } from 'itty-router';

export interface Env {
  RELEASE: string;
  CLICKHOUSE_PASSWORD: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
} & IRequestStrict;
