import { HEY_API_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getPreferences from '@hey/lib/api/getPreferences';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { isAddress } from 'viem';

import getAuthWorkerHeaders from '@/lib/getAuthWorkerHeaders';
import getCurrentSession from '@/lib/getCurrentSession';
import { usePreferencesStore } from '@/store/non-persisted/usePreferencesStore';
import { useProStore } from '@/store/non-persisted/useProStore';
import { useFeatureFlagsStore } from '@/store/persisted/useFeatureFlagsStore';
import { useVerifiedMembersStore } from '@/store/persisted/useVerifiedMembersStore';

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

  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const preferences = await getPreferences(
          sessionProfileId,
          getAuthWorkerHeaders()
        );

        setPreferences({
          isPride: preferences.preference?.isPride || false,
          highSignalNotificationFilter:
            preferences.preference?.highSignalNotificationFilter || false,
          email: preferences.preference?.email || '',
          marketingOptIn: preferences.preference?.marketingOptIn || false
        });
        setIsPro(preferences.pro.enabled);
        setFeatureFlags(preferences.features);
        setStaffMode(preferences.features.includes(FeatureFlag.StaffMode));
        setGardenerMode(
          preferences?.features.includes(FeatureFlag.GardenerMode)
        );
      }
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryKey: ['fetchPreferences', sessionProfileId || ''],
    queryFn: fetchPreferences
  });

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
    queryKey: ['fetchVerifiedMembers'],
    queryFn: fetchVerifiedMembers
  });

  return null;
};

export default PreferencesProvider;
