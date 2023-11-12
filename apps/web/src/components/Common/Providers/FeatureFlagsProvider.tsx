import { FLIPPER_WORKER_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { isAddress } from 'viem';

const FeatureFlagsProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
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
      if (
        Boolean(currentSessionProfileId) &&
        !isAddress(currentSessionProfileId)
      ) {
        const response = await axios.get(
          `${FLIPPER_WORKER_URL}/getFeatureFlags`,
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
    } catch {
    } finally {
      setLoadingFeatureFlags(false);
    }
  };

  useQuery({
    queryKey: ['fetchFeatureFlags', currentSessionProfileId || ''],
    queryFn: fetchFeatureFlags
  });

  return null;
};

export default FeatureFlagsProvider;
