import { InMemoryCache } from '@apollo/client';

import result from '../../generated';
import { profilesManagedKeyFields } from '../lib/keyFields';
import createActedOnPublicationFieldPolicy from './createActedOnPublicationFieldPolicy';
import createApprovedAuthenticationsFieldPolicy from './createApprovedAuthenticationsFieldPolicy';
import createExplorePublicationsFieldPolicy from './createExplorePublicationsFieldPolicy';
import createFeedFieldPolicy from './createFeedFieldPolicy';
import createFeedHighlightsFieldPolicy from './createFeedHighlightsFieldPolicy';
import createFollowersFieldPolicy from './createFollowersFieldPolicy';
import createFollowingFieldPolicy from './createFollowingFieldPolicy';
import createMutualFollowersProfilesFieldPolicy from './createMutualFollowersProfilesFieldPolicy';
import createNftsFieldPolicy from './createNftsFieldPolicy';
import createNotificationsFieldPolicy from './createNotificationsFieldPolicy';
import createProfileActionHistoryFieldPolicy from './createProfileActionHistoryFieldPolicy';
import createProfileManagersFieldPolicy from './createProfileManagersFieldPolicy';
import createProfilesFieldPolicy from './createProfilesFieldPolicy';
import createProfilesManagedFieldPolicy from './createProfilesManagedFieldPolicy';
import createPublicationsFieldPolicy from './createPublicationsFieldPolicy';
import createSearchProfilesFieldPolicy from './createSearchProfilesFieldPolicy';
import createSearchPublicationsPolicy from './createSearchPublicationsPolicy';
import createWhoHaveBlockedFieldPolicy from './createWhoHaveBlockedFieldPolicy';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    ProfilesManagedResult: { keyFields: profilesManagedKeyFields },
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
        whoHaveBlocked: createWhoHaveBlockedFieldPolicy(),
        mutualFollowersProfiles: createMutualFollowersProfilesFieldPolicy(),
        approvedAuthentications: createApprovedAuthenticationsFieldPolicy(),
        profileActionHistory: createProfileActionHistoryFieldPolicy(),
        profileManagers: createProfileManagersFieldPolicy(),
        profilesManaged: createProfilesManagedFieldPolicy()
      }
    }
  }
});

export default cache;
