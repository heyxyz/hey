import Loader from '@components/Shared/Loader';
import { FlagIcon } from '@heroicons/react/24/outline';
import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import { EmptyState, Toggle } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { featureFlags } from 'src/store/usePreferencesStore';

import ToggleWrapper from './ToggleWrapper';

interface UpdateFeatureFlagsProps {
  profile: Profile;
  flags: string[];
}

const UpdateFeatureFlags: FC<UpdateFeatureFlagsProps> = ({
  profile,
  flags
}) => {
  const getAllFeatureFlags = async (): Promise<
    | {
        id: string;
        key: string;
        enabled: boolean;
      }[]
    | []
  > => {
    try {
      const response = await axios.get(
        `${PREFERENCES_WORKER_URL}/getAllFeatureFlags`,
        { params: { id: profile.id } }
      );
      const { data } = response;

      return data?.features || [];
    } catch (error) {
      return [];
    }
  };

  const { data: allFeatureFlags, isLoading } = useQuery({
    queryKey: ['getAllFeatureFlags', profile.id],
    queryFn: getAllFeatureFlags,
    enabled: Boolean(profile.id)
  });

  if (isLoading) {
    return <Loader message="Loading feature flags" />;
  }

  const allFlags = allFeatureFlags || [];
  const enabledFlags = featureFlags();

  if (allFlags.length === 0) {
    return (
      <EmptyState
        message="No feature flags"
        icon={<FlagIcon className="text-brand-500 h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="p-5">
      <div className="space-y-2 font-bold">
        {allFlags.map((flag) => (
          <ToggleWrapper key={flag.key} title={flag.key}>
            <Toggle on={enabledFlags.includes(flag.key)} setOn={() => {}} />
          </ToggleWrapper>
        ))}
      </div>
    </div>
  );
};

export default UpdateFeatureFlags;
