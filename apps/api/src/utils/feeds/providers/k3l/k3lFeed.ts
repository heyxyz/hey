import logger from '@hey/lib/logger';

import k3lGlobalFeed from './algorithms/k3lGlobalFeed';
import k3lPersonalFeed from './algorithms/k3lPersonalFeed';

const k3lFeed = async (
  strategy: string,
  profile: string,
  limit: number,
  offset: number
) => {
  if (profile) {
    logger.info(`[K3L] Personal feed for ${profile}`);
    return await k3lPersonalFeed(strategy, profile, limit, offset);
  }

  logger.info('[K3L] Global feed');
  return await k3lGlobalFeed(strategy, limit, offset);
};

export default k3lFeed;
