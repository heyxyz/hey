import type { Profile } from '@hey/lens';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { Tooltip } from '@hey/ui';
import { type FC } from 'react';

interface EnsProps {
  profile: Profile;
}

const Ens: FC<EnsProps> = ({ profile }) => {
  if (!profile?.onchainIdentity?.ens?.name) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span>
          ENS name: <b>{profile?.onchainIdentity?.ens?.name}</b>
        </span>
      }
      placement="top"
    >
      <img
        alt="ENS Badge"
        className="drop-shadow-xl"
        height={75}
        src={`${STATIC_IMAGES_URL}/badges/ens.png`}
        width={75}
      />
    </Tooltip>
  );
};

export default Ens;
