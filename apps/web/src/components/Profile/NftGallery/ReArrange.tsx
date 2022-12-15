import { arrayMoveImmutable } from 'array-move';
import type { Nft } from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import NftCard from './NftCard';

type Props = {
  nfts: Nft[];
};

const SortableItem: any = SortableElement(({ nft }: { nft: Nft }) => <NftCard nft={nft} />);

const SortableList: any = SortableContainer(({ nfts }: Props) => {
  return (
    <div className="columns-3">
      {nfts.map((nft, index) => (
        <SortableItem key={`${nft.contractAddress}_${nft.tokenId}`} index={index} nft={nft} />
      ))}
    </div>
  );
});

const ReArrange: FC<Props> = ({ nfts }) => {
  const [allNfts, setAllNfts] = useState(nfts);

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const list = arrayMoveImmutable(allNfts, oldIndex, newIndex);
    setAllNfts(list);
  };

  return <SortableList axis="y" nfts={allNfts} onSortEnd={onSortEnd} />;
};

export default ReArrange;
