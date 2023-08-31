import type { OpenSeaNft } from '@lenster/types/opensea-nft';
import { Card, GridItemFour } from '@lenster/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import NftTitle from './Title';

interface NftDetailsProps {
  nft: OpenSeaNft;
}

const NftDetails: FC<NftDetailsProps> = ({ nft }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <GridItemFour className="space-y-4">
      <NftTitle nft={nft} />
      {nft?.description ? (
        <Card className="max-h-60 overflow-y-auto">
          <h1 className="divider px-5 py-4 font-bold">Description</h1>
          <p className="p-5 text-sm opacity-60">{nft.description}</p>
        </Card>
      ) : null}
      <Card className="divide-y dark:divide-gray-700">
        <div className="px-5 py-4">
          <div className="text-sm opacity-50">Contract address</div>
          <div className="truncate">{nft.contract}</div>
        </div>
        <div className="px-5 py-4">
          <div className="text-sm opacity-50">Token ID</div>
          <div className="truncate">{nft.identifier}</div>
        </div>
      </Card>
    </GridItemFour>
  );
};

export default NftDetails;
