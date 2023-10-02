import Footer from '@components/Shared/Footer';
import type { OpenSeaNft } from '@hey/types/opensea-nft';
import { Card, GridItemFour } from '@hey/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

import NftTitle from './Title';
import NftTraits from './Traits';

interface NftDetailsProps {
  nft: OpenSeaNft;
}

const NftDetails: FC<NftDetailsProps> = ({ nft }) => {
  return (
    <GridItemFour className="space-y-4">
      <NftTitle nft={nft} />
      {nft?.description ? (
        <Card className="max-h-60 overflow-y-auto">
          <h1 className="divider px-5 py-4 font-bold">
            <Trans>Description</Trans>
          </h1>
          <p className="p-5 text-sm opacity-60">{nft.description}</p>
        </Card>
      ) : null}
      <Card className="divide-y dark:divide-gray-700">
        <div className="px-5 py-4">
          <div className="text-sm opacity-50">
            <Trans>Contract address</Trans>
          </div>
          <div className="truncate">{nft.contract}</div>
        </div>
        <div className="px-5 py-4">
          <div className="text-sm opacity-50">
            <Trans>Token ID</Trans>
          </div>
          <div className="truncate">{nft.identifier}</div>
        </div>
      </Card>
      <NftTraits nft={nft} />
      <Footer />
    </GridItemFour>
  );
};

export default NftDetails;
