import { development, LensClient, production } from '@lens-protocol/client';

export const lensClient = new LensClient({
  environment: process.env.NODE_ENV === 'production' ? production : development
});
