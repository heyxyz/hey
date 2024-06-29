import type { FC } from 'react';

import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import HeyNft from './HeyNft';
import HeyProfile from './HeyProfile';

interface BadgesProps {
  id: string;
}

const Badges: FC<BadgesProps> = ({ id }) => {
  // Begin: Get isHeyProfile
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
  // End: Get isHeyProfile

  // Begin: Check has Hey NFT
  const getHasHeyNft = async (): Promise<boolean> => {
    const response = await axios.get(`${HEY_API_URL}/badges/hasHeyNft`, {
      params: { id }
    });
    const { data } = response;

    return data?.hasHeyNft || false;
  };

  const { data: hasHeyNft } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getHasHeyNft,
    queryKey: ['getHasHeyNft', id]
  });
  // End: Check has Hey NFT

  const hasBadges = isHeyProfile || hasHeyNft;

  if (!hasBadges) {
    return null;
  }

  return (
    <>
      <div className="divider w-full" />
      <div className="flex flex-wrap gap-3">
        {isHeyProfile && <HeyProfile />}
        {hasHeyNft && <HeyNft />}
      </div>
    </>
  );
};

export default Badges;
