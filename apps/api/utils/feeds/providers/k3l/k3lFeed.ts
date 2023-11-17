import k3lGlobalFeed from './algorithms/k3lGlobalFeed';
import k3lPersonalFeed from './algorithms/k3lPersonalFeed';

const k3lFeed = async (
  strategy: string,
  profile: string,
  limit: number,
  offset: number
) => {
  if (profile) {
    return await k3lPersonalFeed(strategy, profile, limit, offset);
  }

  return await k3lGlobalFeed(strategy, limit, offset);
};

export default k3lFeed;
