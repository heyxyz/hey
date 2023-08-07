import { error } from 'itty-router';

import k3lFeed from '../helpers/providers/k3lFeed';
import lensterFeed from '../helpers/providers/lenster/lensterFeed';
import type { Env } from '../types';

export default async (
  provider: string,
  strategy: string,
  limit: string,
  offset = '0',
  env: Env
) => {
  if (!provider || !strategy) {
    return error(400, 'Bad request!');
  }

  try {
    let ids: string[] = [];
    switch (provider) {
      case 'k3l':
        ids = await k3lFeed(strategy, limit, offset);
        break;
      case 'lenster':
        ids = await lensterFeed(strategy, limit, offset, env);
        break;
      default:
        error(400, 'Bad request!');
    }

    let response = new Response(JSON.stringify({ success: true, ids }));

    // Cache for 10 minutes
    response.headers.set('Cache-Control', 'max-age=600');

    return response;
  } catch (error) {
    throw error;
  }
};
