import type { Publication } from '@hey/lens';
import type { BasicNftMetadata } from '@hey/types/zora-nft';
import { type FC } from 'react';

import ZoraNft from './ZoraNft';

interface NftProps {
  nftMetadata: BasicNftMetadata;
  publication: Publication;
}

const Nft: FC<NftProps> = ({ nftMetadata, publication }) => {
  const { provider } = nftMetadata;

  return provider === 'zora' ? (
    <ZoraNft nftMetadata={nftMetadata} publication={publication} />
  ) : null;
};

export default Nft;
