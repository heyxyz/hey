import { Tooltip } from '@components/UI/Tooltip';
import { Profile } from '@generated/types';
import { FC } from 'react';
import { STATIC_ASSETS } from 'src/constants';

interface Props {
  profile: Profile;
}

const Ens: FC<Props> = ({ profile }) => {
  if (!profile?.onChainIdentity?.ens?.name) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span>
          ENS name: <b>{profile?.onChainIdentity?.ens?.name}</b>
        </span>
      }
      placement="top"
    >
      <img
        className="drop-shadow-xl"
        height={75}
        width={75}
        src={`${STATIC_ASSETS}/badges/ens.png`}
        alt="ENS Badge"
      />
    </Tooltip>
  );
};

export default Ens;
