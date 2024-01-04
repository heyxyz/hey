import type { FC } from 'react';

import { FlagIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import UpdateFeatureFlags from './UpdateFeatureFlags';

interface FeatureFlagsProps {
  features: string[];
  profileId: string;
}

const FeatureFlags: FC<FeatureFlagsProps> = ({ features, profileId }) => {
  const [flags, setFlags] = useState<string[]>([]);

  useEffect(() => {
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
          profileId={profileId}
          setFlags={setFlags}
        />
      </div>
    </>
  );
};

export default FeatureFlags;
