import getIPFSLink from '@lib/getIPFSLink';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  nft: Nft;
  linkToDetail?: boolean;
}

const NFTImage = ({ nft }: { nft: Nft }) => (
  <img
    className="rounded-xl object-cover w-full"
    src={
      nft.originalContent.uri ? getIPFSLink(nft.originalContent.uri) : `${STATIC_IMAGES_URL}/placeholder.webp`
    }
    draggable={false}
    title={nft.name}
    alt={nft.name}
  />
);

const NftCard: FC<Props> = ({ nft, linkToDetail }) => {
  return linkToDetail ? (
    <Link href={`/nft/${nft.contractAddress}/${nft.tokenId}`} className="pb-4 w-full">
      <NFTImage nft={nft} />
    </Link>
  ) : (
    <div className="pb-4 w-full">
      <NFTImage nft={nft} />
    </div>
  );
};

export default NftCard;
