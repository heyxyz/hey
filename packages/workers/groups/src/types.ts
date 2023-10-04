import type { IRequestStrict } from 'itty-router';

export interface Env {
  RELEASE: string;
  SUPABASE_KEY: string;
  GROUPS: KVNamespace;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
} & IRequestStrict;
