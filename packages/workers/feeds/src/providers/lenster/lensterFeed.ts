import type { Env } from '../../types';
import lensterMostInteracted from './algorithms/lensterMostInteracted';
import lensterMostViewed from './algorithms/lensterMostViewed';

const lensterFeed = async (
  strategy: string,
  limit: number,
  offset: number,
  env: Env
) => {
  switch (strategy) {
    case 'mostviewed':
      return await lensterMostViewed(limit, offset, env);
    case 'mostinteracted':
      return await lensterMostInteracted(limit, offset, env);
    default:
      return [];
  }
};

export default lensterFeed;
