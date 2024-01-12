import type { FC } from 'react';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface ViewsProps {
  publicationId: string;
  showCount: boolean;
  views: number;
}

const Views: FC<ViewsProps> = ({ publicationId, showCount, views }) => {
  const setShowPublicationStatsModal = useGlobalModalStateStore(
    (state) => state.setShowPublicationStatsModal
  );

  if (showCount) {
    return null;
  }

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <motion.button
        aria-label="Views"
        className="rounded-full p-1.5 outline-offset-2 outline-gray-400 hover:bg-gray-300/20"
        onClick={() => setShowPublicationStatsModal(true, publicationId)}
        whileTap={{ scale: 0.9 }}
      >
        <Tooltip content={`${humanize(views)} Views`} placement="top" withDelay>
          <ChartBarIcon className="w-[15px] sm:w-[18px]" />
        </Tooltip>
      </motion.button>
      <span className="text-[11px] sm:text-xs">{nFormatter(views)}</span>
    </div>
  );
};

export default Views;
