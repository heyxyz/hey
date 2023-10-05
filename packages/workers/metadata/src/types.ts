import type { IRequestStrict } from 'itty-router';

export interface Env {
  RELEASE: string;
  IRYS_PRIVATE_KEY: string;
  HUGGINGFACE_API_KEY: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
} & IRequestStrict;
