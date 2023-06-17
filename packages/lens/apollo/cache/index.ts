import { InMemoryCache } from '@apollo/client';

import result from '../../generated';
import { publicationKeyFields } from '../lib';
import createExplorePublicationsFieldPolicy from './createExplorePublicationsFieldPolicy';
import createFeedFieldPolicy from './createFeedFieldPolicy';
import createFeedHighlightsFieldPolicy from './createFeedHighlightsFieldPolicy';
import createFollowersFieldPolicy from './createFollowersFieldPolicy';
import createFollowingFieldPolicy from './createFollowingFieldPolicy';
import createForYouFieldPolicy from './createForYouFieldPolicy';
import createMutualFollowersProfilesFieldPolicy from './createMutualFollowersProfilesFieldPolicy';
import createNftsFieldPolicy from './createNftsFieldPolicy';
import createNotificationsFieldPolicy from './createNotificationsFieldPolicy';
import createProfilesFieldPolicy from './createProfilesFieldPolicy';
import createPublicationsFieldPolicy from './createPublicationsFieldPolicy';
import createSearchFieldPolicy from './createSearchFieldPolicy';
import createWhoCollectedPublicationFieldPolicy from './createWhoCollectedPublicationFieldPolicy';
import createWhoReactedPublicationFieldPolicy from './createWhoReactedPublicationFieldPolicy';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Post: { keyFields: publicationKeyFields },
    Comment: { keyFields: publicationKeyFields },
    Mirror: { keyFields: publicationKeyFields },
    Query: {
      fields: {
        feed: createFeedFieldPolicy(),
        feedHighlights: createFeedHighlightsFieldPolicy(),
        forYou: createForYouFieldPolicy(),
        explorePublications: createExplorePublicationsFieldPolicy(),
        publications: createPublicationsFieldPolicy(),
        nfts: createNftsFieldPolicy(),
        notifications: createNotificationsFieldPolicy(),
        followers: createFollowersFieldPolicy(),
        following: createFollowingFieldPolicy(),
        search: createSearchFieldPolicy(),
        profiles: createProfilesFieldPolicy(),
        whoCollectedPublication: createWhoCollectedPublicationFieldPolicy(),
        whoReactedPublication: createWhoReactedPublicationFieldPolicy(),
        mutualFollowersProfiles: createMutualFollowersProfilesFieldPolicy()
      }
    }
  }
});

export default cache;
