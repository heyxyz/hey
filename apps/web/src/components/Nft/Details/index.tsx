import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@lenster/lens';
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
        <Card className="max-h-60 overflow-y-auto p-4">
          <h1 className="mb-2">Description</h1>
          <p className="text-sm opacity-60">{nft.description}</p>
        </Card>
      ) : null}
      <Card className="p-4">
        <h1 className="mb-2">Owner</h1>
        <UserProfile profile={currentProfile as Profile} showUserPreview />
      </Card>
      <Card className="divide-y p-4 dark:divide-gray-700">
        <div className="py-3">
          <div className="text-sm opacity-50">Contract address</div>
          <div className="truncate">{nft.contract}</div>
        </div>
        <div className="pt-3">
          <div className="text-sm opacity-50">Token ID</div>
          <div className="truncate">{nft.identifier}</div>
        </div>
      </Card>
    </GridItemFour>
  );
};

export default NftDetails;
