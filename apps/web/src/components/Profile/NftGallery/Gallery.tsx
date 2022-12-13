import type { Nft } from 'lens';
import type { FC } from 'react';
import React from 'react';

import SingleNFT from './SingleNFT';
type Props = {
  nfts: Nft[];
};

const Gallery: FC<Props> = ({ nfts }) => {
  return (
    <div className="masonry-3-col">
      {nfts?.map((nft) => (
        <div
          key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}
          className="break-inside text-white flex justify-center items-center overflow-hidden"
        >
          <SingleNFT nft={nft as Nft} masonry />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
