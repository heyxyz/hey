import type { ProfileOnchainIdentity } from '@hey/lens';
import type { FC } from 'react';

import Ens from './Ens';
import ProofOfHumanity from './ProofOfHumanity';
import Sybil from './Sybil';
import Worldcoin from './Worldcoin';

interface BadgesProps {
  onchainIdentity: ProfileOnchainIdentity;
}

const Badges: FC<BadgesProps> = ({ onchainIdentity }) => {
  const hasOnChainIdentity =
    onchainIdentity?.proofOfHumanity ||
    onchainIdentity?.sybilDotOrg?.verified ||
    onchainIdentity?.ens?.name ||
    onchainIdentity?.worldcoin?.isHuman;

  if (!hasOnChainIdentity) {
    return null;
  }

  return (
    <>
      <div className="divider w-full" />
      <div className="flex flex-wrap gap-3">
        <ProofOfHumanity onchainIdentity={onchainIdentity} />
        <Ens onchainIdentity={onchainIdentity} />
        <Sybil onchainIdentity={onchainIdentity} />
        <Worldcoin onchainIdentity={onchainIdentity} />
      </div>
    </>
  );
};

export default Badges;
