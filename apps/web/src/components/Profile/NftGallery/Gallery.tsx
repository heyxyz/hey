import SingleNFT from '@components/NFT/SingleNFT';
import type { Nft } from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import { GridContextProvider, GridDropZone, GridItem, swap } from 'react-grid-dnd';
type Props = {
  nfts: Nft[];
};

const Gallery: FC<Props> = ({ nfts }) => {
  const [items, setItems] = useState(nfts.filter((nft) => !nft?.originalContent?.animatedUrl));

  function onChange(sourceId: any, sourceIndex: any, targetIndex: any) {
    const result = swap(items, sourceIndex, targetIndex);
    console.log('🚀 ~ file: Gallery.tsx:20 ~ onChange ~ result', result);
    return setItems([...result]);
  }
  console.log('🚀 ~ file: Gallery.tsx:24 ~ onChange ~ items', items);

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

export default Gallery;
