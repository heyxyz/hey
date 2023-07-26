import type { Env } from '../types';

export default async (hash: string, env: Env) => {
  if (!hash) {
    return new Response('IPFS hash is required', { status: 400 });
  }

  try {
    const image = await fetch(`${env.IPFS_GATEWAY}/ipfs/${hash}`, {
      cf: {
        cacheTtl: 60 * 60 * 24 * 7,
        cacheEverything: true
      }
    });

    return image;
  } catch (error) {
    throw error;
  }
};
