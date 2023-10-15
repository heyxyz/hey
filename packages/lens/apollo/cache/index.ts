import { InMemoryCache } from '@apollo/client';

import result from '../../generated';
import { publicationKeyFields } from '../lib';
import createActedOnPublicationFieldPolicy from './createActedOnPublicationFieldPolicy';
import createApprovedAuthenticationFieldPolicy from './createApprovedAuthenticationFieldPolicy';
import createExplorePublicationsFieldPolicy from './createExplorePublicationsFieldPolicy';
import createFeedFieldPolicy from './createFeedFieldPolicy';
import createFeedHighlightsFieldPolicy from './createFeedHighlightsFieldPolicy';
import createFollowersFieldPolicy from './createFollowersFieldPolicy';
import createFollowingFieldPolicy from './createFollowingFieldPolicy';
import createMutualFollowersProfilesFieldPolicy from './createMutualFollowersProfilesFieldPolicy';
import createNftsFieldPolicy from './createNftsFieldPolicy';
import createNotificationsFieldPolicy from './createNotificationsFieldPolicy';
import createProfileActionHistoryFieldPolicy from './createProfileActionHistoryFieldPolicy';
import createProfilesFieldPolicy from './createProfilesFieldPolicy';
import createPublicationsFieldPolicy from './createPublicationsFieldPolicy';
import createSearchProfilesFieldPolicy from './createSearchProfilesFieldPolicy';
import createSearchPublicationsPolicy from './createSearchPublicationsPolicy';

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
        searchProfiles: createSearchProfilesFieldPolicy(),
        searchPublications: createSearchPublicationsPolicy(),
        whoActedOnPublication: createActedOnPublicationFieldPolicy(),
        mutualFollowersProfiles: createMutualFollowersProfilesFieldPolicy(),
        approvedAuthentication: createApprovedAuthenticationFieldPolicy(),
        profileActionHistory: createProfileActionHistoryFieldPolicy()
      }
    }
  }
});

export default cache;
