import { ChartBarIcon } from '@heroicons/react/24/outline';
import nFormatter from '@hey/lib/nFormatter';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, memo } from 'react';

interface ViewsProps {
  views: number;
  showCount: boolean;
}

const Views: FC<ViewsProps> = ({ views, showCount }) => {
  if (showCount) {
    return null;
  }

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <motion.button
        className="rounded-full p-1.5 outline-offset-2 outline-gray-400 hover:bg-gray-300/20"
        whileTap={{ scale: 0.9 }}
        aria-label="Views"
      >
        <Tooltip placement="top" content="Views" withDelay>
          <ChartBarIcon className="w-[15px] sm:w-[18px]" />
        </Tooltip>
      </motion.button>
      <span className="text-[11px] sm:text-xs">{nFormatter(views)}</span>
    </div>
  );
};

export default memo(Views);
