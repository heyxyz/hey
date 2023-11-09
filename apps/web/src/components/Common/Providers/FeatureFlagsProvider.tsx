import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

const FeatureFlagsProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setFeatureFlags = usePreferencesStore((state) => state.setFeatureFlags);
  const setLoadingPreferences = usePreferencesStore(
    (state) => state.setLoadingPreferences
  );

  const fetchFeatureFlags = async () => {
    try {
      if (Boolean(currentSessionProfileId)) {
        const response = await axios.get(
          `${PREFERENCES_WORKER_URL}/getFeatureFlags`,
          { params: { id: currentSessionProfileId } }
        );
        const { data } = response;

        setFeatureFlags(data?.features || []);
      }
    } catch {
    } finally {
      setLoadingPreferences(false);
    }
  };

  useQuery({
    queryKey: ['fetchFeatureFlags', currentSessionProfileId || ''],
    queryFn: fetchFeatureFlags
  });

  return null;
};

export default FeatureFlagsProvider;
