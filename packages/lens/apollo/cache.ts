import { InMemoryCache } from '@apollo/client';

import result from '../generated';
import createExplorePublicationsFieldPolicy from './fieldPolicies/createExplorePublicationsFieldPolicy';
import createFeedFieldPolicy from './fieldPolicies/createFeedFieldPolicy';
import createFeedHighlightsFieldPolicy from './fieldPolicies/createFeedHighlightsFieldPolicy';
import createFollowersFieldPolicy from './fieldPolicies/createFollowersFieldPolicy';
import createFollowingFieldPolicy from './fieldPolicies/createFollowingFieldPolicy';
import createMutualFollowersProfilesFieldPolicy from './fieldPolicies/createMutualFollowersProfilesFieldPolicy';
import createNftsFieldPolicy from './fieldPolicies/createNftsFieldPolicy';
import createNotificationsFieldPolicy from './fieldPolicies/createNotificationsFieldPolicy';
import createProfilesFieldPolicy from './fieldPolicies/createProfilesFieldPolicy';
import createPublicationsFieldPolicy from './fieldPolicies/createPublicationsFieldPolicy';
import createSearchFieldPolicy from './fieldPolicies/createSearchFieldPolicy';
import createWhoCollectedPublicationFieldPolicy from './fieldPolicies/createWhoCollectedPublicationFieldPolicy';
import createWhoReactedPublicationFieldPolicy from './fieldPolicies/createWhoReactedPublicationFieldPolicy';
import { publicationKeyFields } from './lib';

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
