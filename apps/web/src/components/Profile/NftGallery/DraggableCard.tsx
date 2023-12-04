import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Nft } from '@hey/lens';
import type { FC } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { memo } from 'react';

import NftCard from './NftCard';

interface CardProps {
  id: UniqueIdentifier;
  nft: Nft;
}

const DraggableCard: FC<CardProps> = ({ id, nft }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id,
      transition: null
    });

  const animateStyles = transform
    ? {
        scale: isDragging ? 1.05 : 1,
        x: transform.x,
        y: transform.y,
        zIndex: isDragging ? 1 : 0
      }
    : {
        scale: 1,
        x: 0,
        y: 0
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
      animate={animateStyles}
      className="relative cursor-move"
      layoutId={String(id)}
      ref={setNodeRef}
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

export default memo(DraggableCard);
