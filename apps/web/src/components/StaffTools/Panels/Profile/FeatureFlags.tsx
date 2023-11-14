import { FlagIcon } from '@heroicons/react/24/outline';
import { FEATURES_WORKER_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import type { Profile } from '@hey/lens';
import { Modal } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';

import UpdateFeatureFlags from './UpdateFeatureFlags';

interface FeatureFlagsProps {
  profile: Profile;
}

const FeatureFlags: FC<FeatureFlagsProps> = ({ profile }) => {
  const [showFeatureFlagsModal, setShowFeatureFlagsModal] = useState(false);
  const [flags, setFlags] = useState<string[]>([]);

  const getFeatureFlags = async () => {
    try {
      const response = await axios.get(
        `${FEATURES_WORKER_URL}/getFeatureFlags`,
        { params: { id: profile.id } }
      );
      const { data } = response;

      setFlags(data?.features || []);
      return true;
    } catch (error) {
      return false;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ['getFeatureFlags', profile.id],
    queryFn: getFeatureFlags,
    enabled: Boolean(profile.id)
  });

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <FlagIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Feature flags</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        {isLoading ? (
          <div>Loading...</div>
        ) : flags.length > 0 ? (
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
