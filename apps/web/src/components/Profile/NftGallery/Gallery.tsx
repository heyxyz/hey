import type { Nft } from 'lens';
import type { FC } from 'react';
import React from 'react';

import NftCard from './NftCard';

interface Props {
  nfts: Nft[];
}

const Gallery: FC<Props> = ({ nfts }) => {
  return (
    <div className="grid md:grid-cols-3 gap-5 py-5">
      {nfts?.map((nft) => (
        <div
          key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}
          className="break-inside text-white flex w-full items-center overflow-hidden"
        >
          <NftCard nft={nft as Nft} linkToDetail={true} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
