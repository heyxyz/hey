import { InMemoryCache } from '@apollo/client';

import result from '../../generated';
import { profilesManagedKeyFields } from '../helpers/keyFields';
import createActedOnPublicationFieldPolicy from './createActedOnPublicationFieldPolicy';
import createApprovedAuthenticationsFieldPolicy from './createApprovedAuthenticationsFieldPolicy';
import createExploreProfilesFieldPolicy from './createExploreProfilesFieldPolicy';
import createExplorePublicationsFieldPolicy from './createExplorePublicationsFieldPolicy';
import createFeedFieldPolicy from './createFeedFieldPolicy';
import createFollowersFieldPolicy from './createFollowersFieldPolicy';
import createFollowingFieldPolicy from './createFollowingFieldPolicy';
import createForYouFieldPolicy from './createForYouFieldPolicy';
import createLatestPaidActionsFieldPolicy from './createLatestPaidActionsFieldPolicy';
import createModLatestReportsFieldPolicy from './createModLatestReportsFieldPolicy';
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
        followers: createFollowersFieldPolicy(),
        following: createFollowingFieldPolicy(),
        forYou: createForYouFieldPolicy(),
        latestPaidActions: createLatestPaidActionsFieldPolicy(),
        modExplorePublications: createExplorePublicationsFieldPolicy(),
        modFollowers: createFollowersFieldPolicy(),
        modLatestReports: createModLatestReportsFieldPolicy(),
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
