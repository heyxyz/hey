import response from '@lenster/lib/response';

import type { Env } from '../types';

export default async (hash: string, env: Env) => {
  if (!hash) {
    return response({
      success: false,
      message: 'IPFS hash is required!'
    });
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
