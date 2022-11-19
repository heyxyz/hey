import { Tooltip } from '@components/UI/Tooltip';
import type { Profile } from '@generated/types';
import { CheckCircleIcon } from '@heroicons/react/solid';
import type { FC } from 'react';
import { STATIC_IMAGES_URL } from 'src/constants';

interface Props {
  profile: Profile;
}

const Sybil: FC<Props> = ({ profile }) => {
  if (!profile?.onChainIdentity?.sybilDotOrg?.verified) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span>
          <span className="flex items-center space-x-1">
            <span>Sybil verified</span>
            <CheckCircleIcon className="h-4 w-4" />
          </span>
          <span>
            Twitter: <b>@{profile?.onChainIdentity?.sybilDotOrg?.source?.twitter?.handle}</b>
          </span>
        </span>
      }
      placement="top"
    >
      <img
        className="drop-shadow-xl"
        height={75}
        width={75}
        src={`${STATIC_IMAGES_URL}/badges/sybil.png`}
        alt="Sybil Badge"
      />
    </Tooltip>
  );
};

export default Sybil;
