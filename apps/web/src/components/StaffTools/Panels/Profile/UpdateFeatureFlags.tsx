import Loader from '@components/Shared/Loader';
import { FlagIcon } from '@heroicons/react/24/outline';
import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import type { Features } from '@hey/types/hey';
import { EmptyState, Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import toast from 'react-hot-toast';

import ToggleWrapper from './ToggleWrapper';

interface UpdateFeatureFlagsProps {
  profile: Profile;
  flags: string[];
  setFlags: (flags: string[]) => void;
}

const UpdateFeatureFlags: FC<UpdateFeatureFlagsProps> = ({
  profile,
  flags,
  setFlags
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
  const enabledFlags = flags;

  if (allFlags.length === 0) {
    return (
      <EmptyState
        message="No feature flags"
        icon={<FlagIcon className="text-brand-500 h-8 w-8" />}
        hideCard
      />
    );
  }

  const updateFeatureFlag = async (flag: Features) => {
    const { id, key } = flag;
    const enabled = !enabledFlags.includes(key);

    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/updateFeatureFlag`,
        { id, profile_id: profile.id, enabled },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Updating feature flag...',
        success: () => {
          setFlags(
            enabled
              ? [...enabledFlags, key]
              : enabledFlags.filter((f) => f !== key)
          );
          return 'Feature flag updated';
        },
        error: 'Error updating feature flag'
      }
    );
  };

  return (
    <div className="p-5">
      <div className="space-y-2 font-bold">
        {allFlags.map((flag) => (
          <ToggleWrapper key={flag.key} title={flag.key}>
            <Toggle
              on={enabledFlags.includes(flag.key)}
              setOn={() => updateFeatureFlag(flag)}
            />
          </ToggleWrapper>
        ))}
      </div>
    </div>
  );
};

export default UpdateFeatureFlags;
