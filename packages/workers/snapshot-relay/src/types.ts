import type { IRequestStrict } from 'itty-router';

export interface Env {
  RELEASE: string;
  MAINNET_PROPOSAL_CREATOR_PRIVATE_KEY: string;
  TESTNET_PROPOSAL_CREATOR_PRIVATE_KEY: string;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
} & IRequestStrict;
