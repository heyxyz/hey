import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { FlagIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

import UpdateFeatureFlags from './UpdateFeatureFlags';

interface FeatureFlagsProps {
  features: string[];
  profile: Profile;
}

const FeatureFlags: FC<FeatureFlagsProps> = ({ features, profile }) => {
  const [flags, setFlags] = useState<string[]>([]);

  useUpdateEffect(() => {
    setFlags(features);
  }, [features]);

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <FlagIcon className="size-5" />
        <div className="text-lg font-bold">Feature flags</div>
      </div>
      <div className="mt-3">
        <UpdateFeatureFlags
          flags={flags}
          profile={profile}
          setFlags={setFlags}
        />
      </div>
    </>
  );
};

export default FeatureFlags;
