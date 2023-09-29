import type { Publication } from '@hey/lens';
import type {
  BasePaintCanvasMetadata,
  BasicNftMetadata,
  NftMetadata
} from '@hey/types/nft';
import { type FC } from 'react';

import BasePaintCanvas from './BasePaintCanvas';
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
    <BasePaintCanvas
      nftMetadata={nftMetadata as BasePaintCanvasMetadata}
      publication={publication}
    />
  ) : null;
};

export default Nft;
