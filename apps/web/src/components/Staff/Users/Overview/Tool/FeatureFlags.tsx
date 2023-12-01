import { FlagIcon } from '@heroicons/react/24/outline';
import { FeatureFlag } from '@hey/data/feature-flags';
import type { Profile } from '@hey/lens';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { type FC, useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

import UpdateFeatureFlags from './UpdateFeatureFlags';

interface FeatureFlagsProps {
  profile: Profile;
  features: string[];
}

const FeatureFlags: FC<FeatureFlagsProps> = ({ profile, features }) => {
  const [flags, setFlags] = useState<string[]>([]);

  useUpdateEffect(() => {
    setFlags(features);
  }, [features]);

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <FlagIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Feature flags</div>
      </div>
      <div className="mt-3">
        {isFeatureEnabled(FeatureFlag.FeatureFlipper) && (
          <UpdateFeatureFlags
            profile={profile}
            flags={flags}
            setFlags={setFlags}
          />
        )}
      </div>
    </>
  );
};

export default FeatureFlags;
