import type { Profile } from '@hey/lens';
import type { Features } from '@hey/types/hey';

import Loader from '@components/Shared/Loader';
import { HEY_API_URL } from '@hey/data/constants';
import getAllFeatureFlags from '@hey/lib/api/getAllFeatureFlags';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';

import ToggleWrapper from './ToggleWrapper';

interface UpdateFeatureFlagsProps {
  flags: string[];
  profile: Profile;
  setFlags: (flags: string[]) => void;
}

const UpdateFeatureFlags: FC<UpdateFeatureFlagsProps> = ({
  flags,
  profile,
  setFlags
}) => {
  const [updating, setUpdating] = useState(false);

  const { data: allFeatureFlags, isLoading } = useQuery({
    queryFn: () => getAllFeatureFlags(getAuthWorkerHeaders()),
    queryKey: ['getAllFeatureFlags']
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
        `${HEY_API_URL}/internal/feature/updateProfile`,
        { enabled, id, profile_id: profile.id },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Failed to update feature flag';
        },
        loading: 'Updating feature flag...',
        success: () => {
          setUpdating(false);
          setFlags(
            enabled
              ? [...enabledFlags, key]
              : enabledFlags.filter((f) => f !== key)
          );
          return 'Feature flag updated';
        }
      }
    );
  };

  return (
    <div className="space-y-2 font-bold">
      {availableFlags.map((flag) => (
        <ToggleWrapper key={flag.id} title={flag.key}>
          <Toggle
            disabled={updating}
            on={enabledFlags.includes(flag.key)}
            setOn={() => updateFeatureFlag(flag)}
          />
        </ToggleWrapper>
      ))}
    </div>
  );
};

export default UpdateFeatureFlags;
