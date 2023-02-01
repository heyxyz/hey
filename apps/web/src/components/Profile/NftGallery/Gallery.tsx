import type { Nft } from 'lens';
import type { FC } from 'react';
import React from 'react';

import NftCard from './NftCard';

interface Props {
  nfts: Nft[];
}

const Gallery: FC<Props> = ({ nfts }) => {
  return (
    <div className="grid gap-5 py-5 md:grid-cols-3">
      {nfts?.map((nft) => (
        <div
          key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}
          className="break-inside flex w-full items-center overflow-hidden text-white"
        >
          <NftCard nft={nft as Nft} linkToDetail={true} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
