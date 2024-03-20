import type { Profile } from '@hey/lens';

import { AlgorithmProvider, HomeFeedType } from '@hey/data/enums';

import getPublicationIds from './getPublicationIds';

/**
 * Get the algorithmic feed for a given feed type
 * @param feedType The type of feed to get
 * @param profile The lens profile to get the feed for
 * @returns The algorithmic feed
 */
const getAlgorithmicFeed = async (
  feedType: HomeFeedType,
  profile: null | Profile,
  limit: null | number,
  offset: null | number
) => {
  switch (feedType) {
    case HomeFeedType.K3L_RECOMMENDED:
    case HomeFeedType.K3L_POPULAR:
    case HomeFeedType.K3L_RECENT:
    case HomeFeedType.K3L_CROWDSOURCED:
      return await getPublicationIds(
        AlgorithmProvider.K3L,
        feedType.replace('K3L_', '').toLowerCase(),
        limit,
        offset
      );
    case HomeFeedType.K3L_FOLLOWING:
      return await getPublicationIds(
        AlgorithmProvider.K3L,
        feedType.replace('K3L_', '').toLowerCase(),
        limit,
        offset,
        profile?.handle?.fullHandle
      );
    case HomeFeedType.HEY_MOSTVIEWED:
    case HomeFeedType.HEY_MOSTINTERACTED:
      return await getPublicationIds(
        AlgorithmProvider.HEY,
        feedType.replace('HEY_', '').toLowerCase(),
        limit,
        offset
      );
    default:
      return [];
  }
};

export default getAlgorithmicFeed;
