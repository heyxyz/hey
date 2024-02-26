import type { ProfileOnchainIdentity } from '@hey/lens';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Ens from './Ens';
import HeyProfile from './HeyProfile';
import ProofOfHumanity from './ProofOfHumanity';
import Sybil from './Sybil';
import Worldcoin from './Worldcoin';

interface BadgesProps {
  id: string;
  onchainIdentity: ProfileOnchainIdentity;
}

const Badges: FC<BadgesProps> = ({ id, onchainIdentity }) => {
  const getIsHeyProfile = async (): Promise<boolean> => {
    const response = await axios.get(`${HEY_API_URL}/badges/isHeyProfile`, {
      params: { id }
    });
    const { data } = response;

    return data?.isHeyProfile || false;
  };

  const { data: isHeyProfile } = useQuery({
    queryFn: getIsHeyProfile,
    queryKey: ['getIsHeyProfile', id]
  });

  const hasOnChainIdentity =
    onchainIdentity?.proofOfHumanity ||
    onchainIdentity?.sybilDotOrg?.verified ||
    onchainIdentity?.ens?.name ||
    onchainIdentity?.worldcoin?.isHuman ||
    isHeyProfile;

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
        {isHeyProfile && <HeyProfile />}
      </div>
    </>
  );
};

export default Badges;
