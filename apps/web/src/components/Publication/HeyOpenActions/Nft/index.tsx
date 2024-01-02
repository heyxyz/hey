import type { AnyPublication } from '@hey/lens';
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
  publication?: AnyPublication;
}

const Nft: FC<NftProps> = ({ mintLink, publication }) => {
  const nftMetadata = getNft([mintLink]);

  if (!nftMetadata) {
    return null;
  }

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
  ) : provider === 'sound-release' ? (
    <SoundRelease
      nftMetadata={nftMetadata as SoundReleaseMetadata}
      publication={publication}
    />
  ) : null;
};

export default Nft;
