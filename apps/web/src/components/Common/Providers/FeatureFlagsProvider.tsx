import { FEATURES_WORKER_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getCurrentSession from '@lib/getCurrentSession';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { isAddress } from 'viem';

const FeatureFlagsProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const setFeatureFlags = useFeatureFlagsStore(
    (state) => state.setFeatureFlags
  );
  const setStaffMode = useFeatureFlagsStore((state) => state.setStaffMode);
  const setGardenerMode = useFeatureFlagsStore(
    (state) => state.setGardenerMode
  );
  const setLoadingFeatureFlags = useFeatureFlagsStore(
    (state) => state.setLoadingFeatureFlags
  );

  const fetchFeatureFlags = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const response = await axios.get(
          `${FEATURES_WORKER_URL}/getFeatureFlags`,
          { params: { id: sessionProfileId } }
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
    } catch {
    } finally {
      setLoadingFeatureFlags(false);
    }
  };

  useQuery({
    queryKey: ['fetchFeatureFlags', sessionProfileId || ''],
    queryFn: fetchFeatureFlags
  });

  return null;
};

export default FeatureFlagsProvider;
