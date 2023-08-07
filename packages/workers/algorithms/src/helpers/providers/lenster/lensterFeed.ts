import type { Env } from '../../../types';
import lensterMostViewed from './algorithms/lensterMostViewed';

const lensterFeed = async (
  strategy: string,
  limit: string,
  offset: string,
  env: Env
) => {
  switch (strategy) {
    case 'most-viewed':
      return await lensterMostViewed(limit, offset, env);
    default:
      return [];
  }
};

export default lensterFeed;
