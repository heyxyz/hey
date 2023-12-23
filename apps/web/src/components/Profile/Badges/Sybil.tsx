import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { Tooltip } from '@hey/ui';

interface SybilProps {
  profile: Profile;
}

const Sybil: FC<SybilProps> = ({ profile }) => {
  if (!profile?.onchainIdentity?.sybilDotOrg?.verified) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span>
          <span className="flex items-center space-x-1">
            <span>Sybil verified</span>
            <CheckCircleIcon className="size-4" />
          </span>
          <span>
            X:{' '}
            <b>
              @{profile?.onchainIdentity?.sybilDotOrg?.source?.twitter?.handle}
            </b>
          </span>
        </span>
      }
      placement="top"
    >
      <img
        alt="Sybil Badge"
        className="drop-shadow-xl"
        height={75}
        src={`${STATIC_IMAGES_URL}/badges/sybil.png`}
        width={75}
      />
    </Tooltip>
  );
};

export default Sybil;
