import type { FC } from 'react';

import { GoodMembershipNft } from '@good/abis';
import { GOOD_MEMBERSHIP_NFT } from '@good/data/constants';
import { NumberedStat } from '@good/ui';
import { useReadContract } from 'wagmi';

const NftsMinted: FC = () => {
  const { data: totalSupply } = useReadContract({
    abi: GoodMembershipNft,
    address: GOOD_MEMBERSHIP_NFT,
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
