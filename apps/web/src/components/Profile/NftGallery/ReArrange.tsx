import update from 'immutability-helper';
import type { Nft } from 'lens';
import type { FC } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DraggableCard from './DraggableCard';

interface Props {
  nfts: Nft[];
}

const ReArrange: FC<Props> = ({ nfts }) => {
  const [allNfts, setAllNfts] = useState(nfts);
  const gridRef = useRef<HTMLDivElement>(null);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setAllNfts((prevCards: Nft[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as Nft]
        ]
      })
    );
  }, []);

  const renderNftCard = useCallback((nft: Nft, index: number) => {
    return (
      <DraggableCard
        index={index}
        nft={nft}
        key={`${nft.contractAddress}-${nft.tokenId}`}
        id={`${nft.contractAddress}-${nft.tokenId}`}
        moveCard={moveCard}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div ref={gridRef} className="grid gap-5 py-5 md:grid-cols-3">
        {allNfts.map((card, i) => renderNftCard(card, i))}
      </div>
    </DndProvider>
  );
};

export default ReArrange;
