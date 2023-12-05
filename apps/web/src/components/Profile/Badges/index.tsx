import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import Ens from './Ens';
import ProofOfHumanity from './ProofOfHumanity';
import Sybil from './Sybil';
import Worldcoin from './Worldcoin';

interface BadgesProps {
  profile: Profile;
}

const Badges: FC<BadgesProps> = ({ profile }) => {
  const hasOnChainIdentity =
    profile?.onchainIdentity?.proofOfHumanity ||
    profile?.onchainIdentity?.sybilDotOrg?.verified ||
    profile?.onchainIdentity?.ens?.name ||
    profile?.onchainIdentity?.worldcoin?.isHuman;

  if (!hasOnChainIdentity) {
    return null;
  }

  return (
    <>
      <div className="divider w-full" />
      <div className="flex flex-wrap gap-3">
        <ProofOfHumanity profile={profile} />
        <Ens profile={profile} />
        <Sybil profile={profile} />
        <Worldcoin profile={profile} />
      </div>
    </>
  );
};

export default Badges;
