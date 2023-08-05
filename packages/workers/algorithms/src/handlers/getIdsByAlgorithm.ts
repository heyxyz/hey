import { error } from 'itty-router';

import k3lFeed from '../helpers/k3lFeed';

export default async (
  provider: string,
  strategy: string,
  limit: string,
  offset = '0'
) => {
  if (!provider || !strategy) {
    return error(400, 'Bad request!');
  }

  try {
    let ids: string[] = [];
    switch (provider) {
      case 'k3l':
        ids = await k3lFeed(strategy, limit, offset);
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
