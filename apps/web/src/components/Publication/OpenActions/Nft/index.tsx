import type { Publication } from '@hey/lens';
import type {
  BasePaintCanvasMetadata,
  BasicNftMetadata,
  NftMetadata,
  UnlonelyChannelMetadata,
  UnlonelyNfcMetadata
} from '@hey/types/nft';
import { type FC } from 'react';

import BasePaintCanvas from './BasePaintCanvas';
import UnlonelyChannel from './UnlonelyChannel';
import UnlonelyNfc from './UnlonelyNfc';
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
  ) : provider === 'unlonely-channel' ? (
    <UnlonelyChannel
      nftMetadata={nftMetadata as UnlonelyChannelMetadata}
      publication={publication}
    />
  ) : provider === 'unlonely-nfc' ? (
    <UnlonelyNfc
      nftMetadata={nftMetadata as UnlonelyNfcMetadata}
      publication={publication}
    />
  ) : null;
};

export default Nft;
