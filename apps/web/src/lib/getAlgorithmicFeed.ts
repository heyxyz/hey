import { AlgorithmProvider, HomeFeedType } from '@lenster/data/enums';
import type { Profile } from '@lenster/lens';
import getPublicationIds from '@lenster/lib/getPublicationIds';

/**
 * Get the algorithmic feed for a given feed type
 * @param feedType The type of feed to get
 * @param profile The lens profile to get the feed for
 * @returns The algorithmic feed
 */
const getAlgorithmicFeed = async (
  feedType: HomeFeedType,
  profile: Profile | null
) => {
  switch (feedType) {
    case HomeFeedType.K3L_RECOMMENDED:
    case HomeFeedType.K3L_POPULAR:
    case HomeFeedType.K3L_RECENT:
    case HomeFeedType.K3L_CROWDSOURCED:
      return getPublicationIds(
        AlgorithmProvider.K3L,
        feedType.replace('K3L_', '').toLowerCase()
      ).then((data) => data);
    case HomeFeedType.K3L_FOLLOWING:
      return getPublicationIds(
        AlgorithmProvider.K3L,
        feedType.replace('K3L_', '').toLowerCase(),
        profile?.handle
      ).then((data) => data);
    case HomeFeedType.LENSTER_MOSTVIEWED:
    case HomeFeedType.LENSTER_MOSTINTERACTED:
      return getPublicationIds(
        AlgorithmProvider.LENSTER,
        feedType.replace('LENSTER_', '').toLowerCase()
      ).then((data) => data);
    default:
      return [];
  }
};

export default getAlgorithmicFeed;
