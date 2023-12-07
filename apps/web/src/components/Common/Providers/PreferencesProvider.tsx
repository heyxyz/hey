import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getPreferences from '@hey/lib/api/getPreferences';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import getCurrentSession from '@lib/getCurrentSession';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMembershipNftStore } from 'src/store/non-persisted/useMembershipNftStore';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useProStore } from 'src/store/non-persisted/useProStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useVerifiedMembersStore } from 'src/store/persisted/useVerifiedMembersStore';
import { isAddress } from 'viem';

const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const setVerifiedMembers = useVerifiedMembersStore(
    (state) => state.setVerifiedMembers
  );
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const setIsPro = useProStore((state) => state.setIsPro);
  const setFeatureFlags = useFeatureFlagsStore(
    (state) => state.setFeatureFlags
  );
  const setStaffMode = useFeatureFlagsStore((state) => state.setStaffMode);
  const setGardenerMode = useFeatureFlagsStore(
    (state) => state.setGardenerMode
  );
  const setDismissedOrMinted = useMembershipNftStore(
    (state) => state.setDismissedOrMinted
  );

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const preferences = await getPreferences(
          sessionProfileId,
          getAuthWorkerHeaders()
        );

        // Profile preferences
        setPreferences({
          highSignalNotificationFilter:
            preferences.preference?.highSignalNotificationFilter || false,
          isPride: preferences.preference?.isPride || false
        });

        // Pro
        setIsPro(preferences.pro.enabled);

        // Feature flags
        setFeatureFlags(preferences.features);
        setStaffMode(preferences.features.includes(FeatureFlag.StaffMode));
        setGardenerMode(
          preferences?.features.includes(FeatureFlag.GardenerMode)
        );

        // Membership NFT
        setDismissedOrMinted(preferences.membershipNft.dismissedOrMinted);
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
      const response = await axios.get(`${HEY_API_URL}/misc/getVerified`);
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
