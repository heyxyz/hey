import type { Nft } from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import { GridContextProvider, GridDropZone, GridItem, swap } from 'react-grid-dnd';

import SingleNFT from './SingleNFT';
type Props = {
  nfts: Nft[];
};

const ReArrange: FC<Props> = ({ nfts }) => {
  const [items, setItems] = useState(nfts.filter((nft) => !nft?.originalContent?.animatedUrl));

  function onChange(_sourceId: string, sourceIndex: number, targetIndex: number) {
    const results = swap(items, sourceIndex, targetIndex);
    return setItems(results);
  }

  return (
    <GridContextProvider onChange={onChange}>
      <GridDropZone id="nftGallery" className="h-full" boxesPerRow={3} rowHeight={270}>
        {items?.map((nft) => (
          <GridItem
            key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}
            className="break-inside text-white flex justify-center items-center overflow-hidden"
          >
            <SingleNFT nft={nft as Nft} />
          </GridItem>
        ))}
      </GridDropZone>
    </GridContextProvider>
  );
};

export default ReArrange;
