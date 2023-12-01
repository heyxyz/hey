import { FlagIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import type { Features } from '@hey/types/hey';
import { EmptyState, Toggle } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';

import Loader from '@/components/Shared/Loader';
import getAuthWorkerHeaders from '@/lib/getAuthWorkerHeaders';

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
  const [updating, setUpdating] = useState(false);

  const getAllFeatureFlags = async (): Promise<Features[] | []> => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/feature/getAllFeatureFlags`,
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

  const availableFlags = allFeatureFlags || [];
  const enabledFlags = flags;

  if (availableFlags.length === 0) {
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

    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/feature/updateFeatureFlag`,
        { id, profile_id: profile.id, enabled },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Updating feature flag...',
        success: () => {
          setUpdating(false);
          setFlags(
            enabled
              ? [...enabledFlags, key]
              : enabledFlags.filter((f) => f !== key)
          );
          return 'Feature flag updated';
        },
        error: () => {
          setUpdating(false);
          return 'Failed to update feature flag';
        }
      }
    );
  };

  return (
    <div className="max-h-[80vh] space-y-4 overflow-y-auto p-5">
      {availableFlags.map((flag) => (
        <div key={flag.id} className="flex items-center space-x-3">
          <Toggle
            on={enabledFlags.includes(flag.key)}
            setOn={() => updateFeatureFlag(flag)}
            disabled={updating}
          />
          <code className="ld-text-gray-500 text-sm font-bold">{flag.key}</code>
        </div>
      ))}
    </div>
  );
};

export default UpdateFeatureFlags;
