import { InMemoryCache } from '@apollo/client';

import result from '../../generated';
import { profilesManagedKeyFields } from '../lib/keyFields';
import createActedOnPublicationFieldPolicy from './createActedOnPublicationFieldPolicy';
import createApprovedAuthenticationsFieldPolicy from './createApprovedAuthenticationsFieldPolicy';
import createExploreProfilesFieldPolicy from './createExploreProfilesFieldPolicy';
import createExplorePublicationsFieldPolicy from './createExplorePublicationsFieldPolicy';
import createFeedFieldPolicy from './createFeedFieldPolicy';
import createFeedHighlightsFieldPolicy from './createFeedHighlightsFieldPolicy';
import createFollowersFieldPolicy from './createFollowersFieldPolicy';
import createFollowingFieldPolicy from './createFollowingFieldPolicy';
import createLatestPaidActionsFieldPolicy from './createLatestPaidActionsFieldPolicy';
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
        approvedAuthentications: createApprovedAuthenticationsFieldPolicy(),
        exploreProfiles: createExploreProfilesFieldPolicy(),
        explorePublications: createExplorePublicationsFieldPolicy(),
        feed: createFeedFieldPolicy(),
        feedHighlights: createFeedHighlightsFieldPolicy(),
        followers: createFollowersFieldPolicy(),
        following: createFollowingFieldPolicy(),
        latestPaidActions: createLatestPaidActionsFieldPolicy(),
        modExplorePublications: createExplorePublicationsFieldPolicy(),
        modFollowers: createFollowersFieldPolicy(),
        mutualFollowersProfiles: createMutualFollowersProfilesFieldPolicy(),
        nfts: createNftsFieldPolicy(),
        notifications: createNotificationsFieldPolicy(),
        profileActionHistory: createProfileActionHistoryFieldPolicy(),
        profileManagers: createProfileManagersFieldPolicy(),
        profiles: createProfilesFieldPolicy(),
        profilesManaged: createProfilesManagedFieldPolicy(),
        publications: createPublicationsFieldPolicy(),
        publicationsProfileBookmarks: createPublicationsFieldPolicy(),
        searchProfiles: createSearchProfilesFieldPolicy(),
        searchPublications: createSearchPublicationsPolicy(),
        whoActedOnPublication: createActedOnPublicationFieldPolicy(),
        whoHaveBlocked: createWhoHaveBlockedFieldPolicy()
      }
    }
  }
});

export default cache;
