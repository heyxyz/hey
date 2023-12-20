import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';

import ActivateLifetimePro from './ActivateLifetimePro';
import Verify from './Verify';

interface RankProps {
  isPro: boolean;
  profile: Profile;
}

const Access: FC<RankProps> = ({ isPro, profile }) => {
  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="size-5" />
        <div className="text-lg font-bold">Access</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <Verify profile={profile} />
        <ActivateLifetimePro isPro={isPro} profile={profile} />
      </div>
    </>
  );
};

export default Access;
