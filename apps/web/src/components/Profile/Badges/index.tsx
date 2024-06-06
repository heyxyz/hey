import type { ProfileOnchainIdentity } from '@good/lens';
import type { FC } from 'react';

import { GOOD_API_URL, IS_MAINNET } from '@good/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Ens from './Ens';
import GoodNft from './GoodNft';
import GoodProfile from './GoodProfile';
import ProofOfHumanity from './ProofOfHumanity';
import Sybil from './Sybil';
import Worldcoin from './Worldcoin';

interface BadgesProps {
  id: string;
  onchainIdentity: ProfileOnchainIdentity;
}

const Badges: FC<BadgesProps> = ({ id, onchainIdentity }) => {
  // Begin: Get isGoodProfile
  const getIsGoodProfile = async (): Promise<boolean> => {
    const response = await axios.get(`${GOOD_API_URL}/badges/isGoodProfile`, {
      params: { id }
    });
    const { data } = response;

    return data?.isGoodProfile || false;
  };

  const { data: isGoodProfile } = useQuery({
    queryFn: getIsGoodProfile,
    queryKey: ['getIsGoodProfile', id]
  });
  // End: Get isGoodProfile

  // Begin: Check has Good NFT
  const getHasGoodNft = async (): Promise<boolean> => {
    const response = await axios.get(`${GOOD_API_URL}/badges/hasGoodNft`, {
      params: { id }
    });
    const { data } = response;

    return data?.hasGoodNft || false;
  };

  const { data: hasGoodNft } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getHasGoodNft,
    queryKey: ['getHasGoodNft', id]
  });
  // End: Check has Good NFT

  const hasOnChainIdentity =
    onchainIdentity?.proofOfHumanity ||
    onchainIdentity?.sybilDotOrg?.verified ||
    onchainIdentity?.ens?.name ||
    onchainIdentity?.worldcoin?.isHuman ||
    isGoodProfile ||
    hasGoodNft;

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
        {isGoodProfile && <GoodProfile />}
        {hasGoodNft && <GoodNft />}
      </div>
    </>
  );
};

export default Badges;
