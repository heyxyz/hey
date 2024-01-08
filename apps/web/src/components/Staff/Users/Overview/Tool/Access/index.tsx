import type { Preferences } from '@hey/types/hey';
import type { FC } from 'react';

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';

import ActivateLifetimePro from './ActivateLifetimePro';
import Verify from './Verify';

interface AccessProps {
  preferences: Preferences;
  profileId: string;
}

const Access: FC<AccessProps> = ({ preferences, profileId }) => {
  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="size-5" />
        <div className="text-lg font-bold">Access</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <Verify profileId={profileId} />
        <ActivateLifetimePro isPro={preferences.isPro} profileId={profileId} />
      </div>
    </>
  );
};

export default Access;
