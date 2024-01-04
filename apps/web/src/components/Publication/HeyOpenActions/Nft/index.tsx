import type {
  BasePaintCanvasMetadata,
  BasicNftMetadata,
  SoundReleaseMetadata,
  UnlonelyChannelMetadata,
  UnlonelyNfcMetadata
} from '@hey/types/nft';
import type { FC } from 'react';

import getNft from '@hey/lib/nft/getNft';

import BasePaintCanvas from './BasePaintCanvas';
import SoundRelease from './SoundRelease';
import UnlonelyChannel from './UnlonelyChannel';
import UnlonelyNfc from './UnlonelyNfc';
import ZoraNft from './ZoraNft';

interface NftProps {
  mintLink: string;
  publicationId: string;
}

const Nft: FC<NftProps> = ({ mintLink, publicationId }) => {
  const nftMetadata = getNft([mintLink]);

  if (!nftMetadata) {
    return null;
  }

  const { provider } = nftMetadata;

  return provider === 'zora' ? (
    <ZoraNft
      nftMetadata={nftMetadata as BasicNftMetadata}
      publicationId={publicationId}
    />
  ) : provider === 'basepaint' ? (
    <BasePaintCanvas
      nftMetadata={nftMetadata as BasePaintCanvasMetadata}
      publicationId={publicationId}
    />
  ) : provider === 'unlonely-channel' ? (
    <UnlonelyChannel
      nftMetadata={nftMetadata as UnlonelyChannelMetadata}
      publicationId={publicationId}
    />
  ) : provider === 'unlonely-nfc' ? (
    <UnlonelyNfc
      nftMetadata={nftMetadata as UnlonelyNfcMetadata}
      publicationId={publicationId}
    />
  ) : provider === 'sound-release' ? (
    <SoundRelease
      nftMetadata={nftMetadata as SoundReleaseMetadata}
      publicationId={publicationId}
    />
  ) : null;
};

export default Nft;
