import type { Publication } from '@hey/lens';
import type {
  BasePaintNftMetadata,
  BasicNftMetadata,
  NftMetadata
} from '@hey/types/nft';
import { type FC } from 'react';

import BasePaintNft from './BasePaintNft';
import ZoraNft from './ZoraNft';

interface NftProps {
  nftMetadata: NftMetadata;
  publication: Publication;
}

const Nft: FC<NftProps> = ({ nftMetadata, publication }) => {
  const { provider } = nftMetadata;

  return provider === 'zora' ? (
    <ZoraNft
      nftMetadata={nftMetadata as BasicNftMetadata}
      publication={publication}
    />
  ) : provider === 'basepaint' ? (
    <BasePaintNft
      nftMetadata={nftMetadata as BasePaintNftMetadata}
      publication={publication}
    />
  ) : null;
};

export default Nft;
