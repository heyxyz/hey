import type { NftOwnershipCondition as NftOwnershipConditionType } from '@hey/lens';
import type { FC } from 'react';

import useContractMetadata from 'src/hooks/alchemy/useContractMetadata';

interface NftOwnershipConditionProps {
  condition: NftOwnershipConditionType;
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
    <div className="flex flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2">
      <div>Must own the NFT:</div>
      {loading ? (
        <div className="shimmer h-3 w-28 rounded-lg" />
      ) : (
        <div className="flex items-center space-x-2">
          {data?.openSeaMetadata.imageUrl ? (
            <img
              className="h-5 w-5 rounded"
              src={data?.openSeaMetadata.imageUrl}
            />
          ) : null}
          <div>
            {data?.name} ({data?.symbol})
          </div>
          {condition?.tokenIds?.length === 1 ? (
            <div>({condition.tokenIds.map((tokenId) => `#${tokenId}`)})</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NftOwnershipCondition;
