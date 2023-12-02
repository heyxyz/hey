import Loader from '@components/Shared/Loader';
import { HEY_API_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import type { Features } from '@hey/types/hey';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';
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
  const [updating, setUpdating] = useState(false);

  const getAllFeatureFlags = async (): Promise<Features[] | []> => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/feature/getAllFeatureFlags`,
        { headers: getAuthWorkerHeaders() }
      );
      const { data } = response;

      return data?.features || [];
    } catch (error) {
      return [];
    }
  };

  const { data: allFeatureFlags, isLoading } = useQuery({
    queryKey: ['getAllFeatureFlags'],
    queryFn: getAllFeatureFlags
  });

  if (isLoading) {
    return <Loader message="Loading feature flags" />;
  }

  const availableFlags = allFeatureFlags || [];
  const enabledFlags = flags;

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
    <div className="space-y-2 font-bold">
      {availableFlags.map((flag) => (
        <ToggleWrapper key={flag.id} title={flag.key}>
          <Toggle
            on={enabledFlags.includes(flag.key)}
            setOn={() => updateFeatureFlag(flag)}
            disabled={updating}
          />
        </ToggleWrapper>
      ))}
    </div>
  );
};

export default UpdateFeatureFlags;
