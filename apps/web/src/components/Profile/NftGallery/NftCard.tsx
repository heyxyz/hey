import getIPFSLink from '@lib/getIPFSLink';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import type { FC } from 'react';

interface Props {
  nft: Nft;
}

const NftCard: FC<Props> = ({ nft }) => {
  return (
    <div className="pb-4 w-full">
      <img
        className="rounded-xl object-cover w-full"
        src={
          nft.originalContent.uri
            ? getIPFSLink(nft.originalContent.uri)
            : `${STATIC_IMAGES_URL}/placeholder.webp`
        }
        draggable={false}
        title={nft.name}
        alt={nft.name}
      />
    </div>
  );
};

export default NftCard;
