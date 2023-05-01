import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import type { Nft } from 'lens';
import type { FC } from 'react';
import React from 'react';

import NftCard from './NftCard';

interface CardProps {
  id: UniqueIdentifier;
  nft: Nft;
}

const DraggableCard: FC<CardProps> = ({ id, nft }) => {
  const { attributes, setNodeRef, listeners, transform, isDragging } =
    useSortable({
      id,
      transition: null
    });

  const animateStyles = transform
    ? {
        x: transform.x,
        y: transform.y,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 1 : 0
      }
    : {
        x: 0,
        y: 0,
        scale: 1
      };

  const transitionStyles = {
    duration: !isDragging ? 0.25 : 0,
    easings: {
      type: 'spring'
    },
    scale: {
      duration: 0.25
    },
    zIndex: {
      delay: isDragging ? 0 : 0.25
    }
  };

  return (
    <motion.div
      className="relative cursor-move"
      ref={setNodeRef}
      layoutId={String(id)}
      animate={animateStyles}
      transition={transitionStyles}
      {...attributes}
      {...listeners}
    >
      {/* overlay to drag iframe elements */}
      <span className="absolute inset-0" />
      <NftCard nft={nft} />
    </motion.div>
  );
};

export default React.memo(DraggableCard);
