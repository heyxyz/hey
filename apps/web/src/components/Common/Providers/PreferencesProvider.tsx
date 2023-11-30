import { HEY_API_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import getCurrentSession from '@lib/getCurrentSession';
import { useFeatureFlagsStore } from '@persisted/useFeatureFlagsStore';
import { useVerifiedMembersStore } from '@persisted/useVerifiedMembersStore';
import { usePreferencesStore } from '@store/non-persisted/usePreferencesStore';
import { useProStore } from '@store/non-persisted/useProStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
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

  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const response = await axios.get(
          `${HEY_API_URL}/preference/getPreferences`,
          {
            params: { id: sessionProfileId },
            headers: getAuthWorkerHeaders()
          }
        );
        const { data } = response;

        setPreferences({
          isPride: data.result?.preference?.isPride || false,
          highSignalNotificationFilter:
            data.result?.preference?.highSignalNotificationFilter || false,
          email: data.result?.preference?.email || '',
          marketingOptIn: data.result?.preference?.marketingOptIn || false
        });
        setIsPro(data.result?.pro.enabled || false);
        setFeatureFlags(data?.result.features || []);
        setStaffMode(data?.result.features.includes(FeatureFlag.StaffMode));
        setGardenerMode(
          data?.result.features.includes(FeatureFlag.GardenerMode)
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
