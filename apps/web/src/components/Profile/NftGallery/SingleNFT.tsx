import getIPFSLink from '@lib/getIPFSLink';
import clsx from 'clsx';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import type { FC } from 'react';

interface Props {
  nft: Nft;
  masonry?: boolean;
}

const SingleNFT: FC<Props> = ({ nft, masonry }) => {
  return (
    <div className="p-2">
      <img
        className={clsx('rounded-xl object-cover', !masonry && 'h-[260px]')}
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
