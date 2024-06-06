import type { ProfileOnchainIdentity } from '@good/lens';
import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@good/data/constants';
import { Tooltip } from '@good/ui';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ProofOfHumanityProps {
  onchainIdentity: ProfileOnchainIdentity;
}

const ProofOfHumanity: FC<ProofOfHumanityProps> = ({ onchainIdentity }) => {
  if (!onchainIdentity?.proofOfHumanity) {
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
