import type { IRequestStrict } from 'itty-router';
import type { Toucan } from 'toucan-js';

export interface Env {
  SENTRY_DSN: string;
  RELEASE: string;
  MAINNET_PROPOSAL_CREATOR_PRIVATE_KEY: string;
  TESTNET_PROPOSAL_CREATOR_PRIVATE_KEY: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  sentry?: Toucan;
} & IRequestStrict;
