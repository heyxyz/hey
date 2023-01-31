import getIPFSLink from '@lib/getIPFSLink';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import type { FC } from 'react';

interface Props {
  nft: Nft;
}

const NFTImage: FC<Props> = ({ nft }) => (
  <img
    className="rounded-xl object-cover w-full h-64 bg-gray-200 dark:bg-gray-800"
    src={
      nft.originalContent.uri ? getIPFSLink(nft.originalContent.uri) : `${STATIC_IMAGES_URL}/placeholder.webp`
    }
    draggable={false}
    title={nft.name}
    alt={nft.name}
    height={100}
    width={100}
  />
);

const NftCard: FC<Props> = ({ nft }) => {
  return (
    <div className="w-full">
      <NFTImage nft={nft} />
    </div>
  );
};

export default NftCard;
