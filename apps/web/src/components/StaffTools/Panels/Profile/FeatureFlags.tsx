import { FlagIcon } from '@heroicons/react/24/outline';
import { FeatureFlag } from '@hey/data/feature-flags';
import type { Profile } from '@hey/lens';
import { Modal } from '@hey/ui';
import { type FC, useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

import isFeatureEnabled from '@/lib/isFeatureEnabled';

import UpdateFeatureFlags from './UpdateFeatureFlags';

interface FeatureFlagsProps {
  profile: Profile;
  loading: boolean;
  features: string[];
}

const FeatureFlags: FC<FeatureFlagsProps> = ({
  profile,
  loading,
  features
}) => {
  const [showFeatureFlagsModal, setShowFeatureFlagsModal] = useState(false);
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
      <div className="mt-3 space-y-2 font-bold">
        {loading ? (
          <div>Loading...</div>
        ) : flags?.length > 0 ? (
          <div>
            {flags.map((flag) => (
              <div key={flag}>{flag}</div>
            ))}
          </div>
        ) : (
          <div>No feature flags</div>
        )}
        {isFeatureEnabled(FeatureFlag.FeatureFlipper) && (
          <>
            <button
              className="text-sm underline"
              onClick={() => setShowFeatureFlagsModal(true)}
            >
              Update feature flags
            </button>
            <Modal
              show={showFeatureFlagsModal}
              onClose={() => setShowFeatureFlagsModal(false)}
              title="Update feature flags"
              icon={<FlagIcon className="text-brand-500 h-5 w-5" />}
            >
              <UpdateFeatureFlags
                profile={profile}
                flags={flags}
                setFlags={setFlags}
              />
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default FeatureFlags;
