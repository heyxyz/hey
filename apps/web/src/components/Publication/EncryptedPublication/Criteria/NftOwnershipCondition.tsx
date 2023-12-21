import type { FC } from 'react';

import { NftOwnershipCondition } from '@hey/lens';
import useContractMetadata from 'src/hooks/alchemy/useContractMetadata';

interface NftOwnershipConditionProps {
  condition: NftOwnershipCondition;
}

const NftOwnershipCondition: FC<NftOwnershipConditionProps> = ({
  condition
}) => {
  const { data, loading } = useContractMetadata({
    address: condition.contract.address,
    chain: condition.contract.chainId,
    enabled: Boolean(condition.contract)
  });

  return (
    <div className="flex items-center space-x-2">
      <div>Must own the NFT:</div>
      {loading ? (
        <div className="shimmer h-3 w-28 rounded-lg" />
      ) : (
        <div>
          {data?.name} ({data?.symbol})
        </div>
      )}
    </div>
  );
};

export default NftOwnershipCondition;
