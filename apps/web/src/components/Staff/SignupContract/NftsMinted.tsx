import type { FC } from 'react';

import { HeyMembershipNft } from '@hey/abis';
import { HEY_MEMBERSHIP_NFT } from '@hey/data/constants';
import { useReadContract } from 'wagmi';

import NumberedStat from '../UI/NumberedStat';

const NftsMinted: FC = () => {
  const { data: totalSupply } = useReadContract({
    abi: HeyMembershipNft,
    address: HEY_MEMBERSHIP_NFT,
    functionName: 'totalSupply',
    query: { refetchInterval: 2000 }
  });

  return (
    <NumberedStat
      count={totalSupply?.toString() || '0'}
      name={`Total Membership NFTs`}
      suffix="NFTs"
    />
  );
};

export default NftsMinted;
