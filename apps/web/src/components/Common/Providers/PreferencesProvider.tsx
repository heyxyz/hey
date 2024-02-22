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
import { isAddress } from 'viem';

const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const setVerifiedMembers = useVerifiedMembersStore(
    (state) => state.setVerifiedMembers
  );
  const setHighSignalNotificationFilter = usePreferencesStore(
    (state) => state.setHighSignalNotificationFilter
  );
  const setIsPride = usePreferencesStore((state) => state.setIsPride);
  const setRestriction = useProfileRestriction((state) => state.setRestriction);
  const setHasDismissedOrMintedMembershipNft = usePreferencesStore(
    (state) => state.setHasDismissedOrMintedMembershipNft
  );
  const setFeatureFlags = useFeatureFlagsStore(
    (state) => state.setFeatureFlags
  );
  const setStaffMode = useFeatureFlagsStore((state) => state.setStaffMode);
  const setGardenerMode = useFeatureFlagsStore(
    (state) => state.setGardenerMode
  );

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const preferences = await getPreferences(
          sessionProfileId,
          getAuthApiHeaders()
        );

        // Profile preferences
        setHighSignalNotificationFilter(
          preferences.highSignalNotificationFilter
        );
        setIsPride(preferences.isPride);

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
