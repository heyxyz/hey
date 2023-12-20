import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { Tooltip } from '@hey/ui';

interface WorldcoinProps {
  profile: Profile;
}

const Worldcoin: FC<WorldcoinProps> = ({ profile }) => {
  if (!profile?.onchainIdentity?.worldcoin?.isHuman) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span className="flex items-center space-x-1">
          <span>Worldcoin verified</span>
          <CheckCircleIcon className="size-4" />
        </span>
      }
      placement="top"
    >
      <img
        alt="Worldcoin Badge"
        className="drop-shadow-xl"
        height={75}
        src={`${STATIC_IMAGES_URL}/badges/worldcoin.png`}
        width={75}
      />
    </Tooltip>
  );
};

export default Worldcoin;
