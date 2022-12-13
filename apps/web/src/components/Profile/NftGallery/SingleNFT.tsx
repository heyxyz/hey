import getIPFSLink from '@lib/getIPFSLink';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import type { FC } from 'react';

interface Props {
  nft: Nft;
}

const SingleNFT: FC<Props> = ({ nft }) => {
  return (
    <div className="p-2">
      <img
        className="rounded-xl h-[260px] object-cover"
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

export default SingleNFT;
