import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useNftGalleryStore } from 'src/store/nft-gallery';

import DraggableCard from './DraggableCard';

const ReArrange: FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);
  const [allNfts, setAllNfts] = useState(gallery.items);

  useEffect(() => {
    setGallery({ ...gallery, items: allNfts });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNfts]);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) {
      return;
    }
    setAllNfts((items) =>
      arrayMove(
        items,
        items.findIndex((i) => i.itemId === active?.id),
        items.findIndex((i) => i.itemId === over?.id)
      )
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        strategy={rectSortingStrategy}
        items={allNfts.map((i) => `${i.chainId}_${i.contractAddress}_${i.tokenId}`)}
      >
        <div ref={gridRef} className="grid gap-5 py-5 md:grid-cols-3">
          {allNfts.map((item) => {
            const id = `${item.chainId}_${item.contractAddress}_${item.tokenId}`;
            return <DraggableCard key={id} id={id} nft={item} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ReArrange;
