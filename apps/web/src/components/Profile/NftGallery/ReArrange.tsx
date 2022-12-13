import { arrayMoveImmutable } from 'array-move';
import type { Nft } from 'lens';
import React, { useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import SingleNFT from './SingleNFT';

const SortableItem: any = SortableElement(({ nft }: { nft: Nft }) => <SingleNFT nft={nft} masonry />);

const SortableList: any = SortableContainer(({ nfts }: { nfts: Nft[] }) => {
  return (
    <div className="masonry-3-col">
      {nfts.map((nft, index) => (
        <SortableItem key={`${nft.tokenId}-${index}`} index={index} nft={nft} />
      ))}
    </div>
  );
});

const ReArrange = ({ nfts }: { nfts: Nft[] }) => {
  const [allNfts, setAllNfts] = useState(nfts);

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const list = arrayMoveImmutable(allNfts, oldIndex, newIndex);
    setAllNfts(list);
  };

  return <SortableList axis="xy" nfts={allNfts} onSortEnd={onSortEnd} />;
};

export default ReArrange;
