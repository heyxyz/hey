import type { Env } from '../../types';
import heyMostInteracted from './algorithms/heyMostInteracted';
import heyMostViewed from './algorithms/heyMostViewed';

const heyFeed = async (
  strategy: string,
  limit: number,
  offset: number,
  env: Env
) => {
  switch (strategy) {
    case 'mostviewed':
      return await heyMostViewed(limit, offset, env);
    case 'mostinteracted':
      return await heyMostInteracted(limit, offset, env);
    default:
      return [];
  }
};

export default heyFeed;
