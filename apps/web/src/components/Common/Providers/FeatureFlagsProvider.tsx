import { HEY_API_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getCurrentSession from '@lib/getCurrentSession';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useFeatureFlagsStore } from 'src/store/non-persisted/useFeatureFlagsStore';
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

  const fetchFeatureFlags = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const response = await axios.get(
          `${HEY_API_URL}/feature/getFeatureFlags`,
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
    } catch {}
  };

  useQuery({
    queryKey: ['fetchFeatureFlags', sessionProfileId || ''],
    queryFn: fetchFeatureFlags
  });

  return null;
};

export default FeatureFlagsProvider;
