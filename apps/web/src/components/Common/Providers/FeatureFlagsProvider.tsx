import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

const FeatureFlagsProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setFeatureFlags = usePreferencesStore((state) => state.setFeatureFlags);
  const setStaffMode = usePreferencesStore((state) => state.setStaffMode);
  const setGardenerMode = usePreferencesStore((state) => state.setGardenerMode);

  const fetchFeatureFlags = async () => {
    try {
      if (Boolean(currentSessionProfileId)) {
        const response = await axios.get(
          `${PREFERENCES_WORKER_URL}/getFeatureFlags`,
          { params: { id: currentSessionProfileId } }
        );
        const {
          data
        }: {
          data: { features: string[] };
        } = response;

        setFeatureFlags(data?.features || []);
        setStaffMode(data?.features.includes(FeatureFlag.StaffMode));
        setGardenerMode(data?.features.includes(FeatureFlag.GardenerMode));
      }
    } catch {}
  };

  useQuery({
    queryKey: ['fetchFeatureFlags', currentSessionProfileId || ''],
    queryFn: fetchFeatureFlags
  });

  return null;
};

export default FeatureFlagsProvider;
