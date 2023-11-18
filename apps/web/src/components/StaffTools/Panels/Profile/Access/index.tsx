import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import ActivateLifetimePro from './ActivateLifetimePro';
import ActivateProTrial from './ActivatePro';
import Verify from './Verify';

interface RankProps {
  profile: Profile;
}

const Access: FC<RankProps> = ({ profile }) => {
  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Access</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <Verify profile={profile} />
        <ActivateLifetimePro profile={profile} />
        <ActivateProTrial profile={profile} />
      </div>
    </>
  );
};

export default Access;
