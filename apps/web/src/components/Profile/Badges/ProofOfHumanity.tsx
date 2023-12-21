import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { Tooltip } from '@hey/ui';

interface ProofOfHumanityProps {
  profile: Profile;
}

const ProofOfHumanity: FC<ProofOfHumanityProps> = ({ profile }) => {
  if (!profile?.onchainIdentity?.proofOfHumanity) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span className="flex items-center space-x-1">
          <span>Proof of Humanity verified</span>
          <CheckCircleIcon className="size-4" />
        </span>
      }
      placement="top"
    >
      <img
        alt="Proof Of Humanity Badge"
        className="drop-shadow-xl"
        height={75}
        src={`${STATIC_IMAGES_URL}/badges/poh.png`}
        width={75}
      />
    </Tooltip>
  );
};

export default ProofOfHumanity;
