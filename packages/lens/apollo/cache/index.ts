import { InMemoryCache } from '@apollo/client';

import result from '../../generated';
import { publicationKeyFields } from '../lib';
import createExplorePublicationsFieldPolicy from './createExplorePublicationsFieldPolicy';
import createFeedFieldPolicy from './createFeedFieldPolicy';
import createFeedHighlightsFieldPolicy from './createFeedHighlightsFieldPolicy';
import createFollowersFieldPolicy from './createFollowersFieldPolicy';
import createFollowingFieldPolicy from './createFollowingFieldPolicy';
import createMutualFollowersProfilesFieldPolicy from './createMutualFollowersProfilesFieldPolicy';
import createNftsFieldPolicy from './createNftsFieldPolicy';
import createNotificationsFieldPolicy from './createNotificationsFieldPolicy';
import createProfilesFieldPolicy from './createProfilesFieldPolicy';
import createPublicationsFieldPolicy from './createPublicationsFieldPolicy';

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
        explorePublications: createExplorePublicationsFieldPolicy(),
        publications: createPublicationsFieldPolicy(),
        publicationsProfileBookmarks: createPublicationsFieldPolicy(),
        nfts: createNftsFieldPolicy(),
        notifications: createNotificationsFieldPolicy(),
        followers: createFollowersFieldPolicy(),
        following: createFollowingFieldPolicy(),
        profiles: createProfilesFieldPolicy(),
        mutualFollowersProfiles: createMutualFollowersProfilesFieldPolicy()
      }
    }
  }
});

export default cache;
