import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getPreferences from '@hey/lib/api/getPreferences';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import getCurrentSession from '@lib/getCurrentSession';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useVerifiedMembersStore } from 'src/store/persisted/useVerifiedMembersStore';

const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setVerifiedMembers } = useVerifiedMembersStore();
  const {
    setEmail,
    setEmailVerified,
    setHasDismissedOrMintedMembershipNft,
    setHighSignalNotificationFilter,
    setIsPride
  } = usePreferencesStore();
  const { setRestriction } = useProfileRestriction();
  const { setFeatureFlags, setGardenerMode, setStaffMode } =
    useFeatureFlagsStore();

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId)) {
        const preferences = await getPreferences(
          sessionProfileId,
          getAuthApiHeaders()
        );

        // Profile preferences
        setHighSignalNotificationFilter(
          preferences.highSignalNotificationFilter
        );
        setIsPride(preferences.isPride);

        // Email preferences
        setEmail(preferences.email || '');
        setEmailVerified(preferences.emailVerified);

        // Feature flags
        setFeatureFlags(preferences.features);
        setStaffMode(preferences.features.includes(FeatureFlag.StaffMode));
        setGardenerMode(
          preferences?.features.includes(FeatureFlag.GardenerMode)
        );
        setRestriction({
          isFlagged: preferences.features.includes(FeatureFlag.Flagged),
          isSuspended: preferences.features.includes(FeatureFlag.Suspended)
        });

        // Membership NFT
        setHasDismissedOrMintedMembershipNft(
          preferences.hasDismissedOrMintedMembershipNft
        );
      }
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchPreferences,
    queryKey: ['fetchPreferences', sessionProfileId || '']
  });

  // Fetch verified members
  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/misc/verified`);
      const { data } = response;
      setVerifiedMembers(data.result || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchVerifiedMembers,
    queryKey: ['fetchVerifiedMembers']
  });

  return null;
};

export default PreferencesProvider;
