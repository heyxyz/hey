import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import humanize from '@hey/helpers/humanize';
import nFormatter from '@hey/helpers/nFormatter';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import plur from 'plur';

interface OpenActionProps {
  publication: MirrorablePublication;
}

const OpenAction: FC<OpenActionProps> = ({ publication }) => {
  const { countOpenActions } = publication.stats;

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <motion.button
        aria-label="Action"
        className="cursor-default rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        whileTap={{ scale: 0.9 }}
      >
        <Tooltip
          content={`${humanize(countOpenActions)} ${plur(
            'Action',
            countOpenActions
          )}`}
          placement="top"
          withDelay
        >
          <ShoppingBagIcon className="w-[15px] sm:w-[18px]" />
        </Tooltip>
      </motion.button>
      {countOpenActions > 0 ? (
        <span className="text-[11px] sm:text-xs">
          {nFormatter(countOpenActions)}
        </span>
      ) : null}
    </div>
  );
};

export default OpenAction;
