import type { MirrorablePublication } from '@good/lens';
import type { FC } from 'react';

import { PUBLICATION } from '@good/data/tracking';
import allowedOpenActionModules from '@good/helpers/allowedOpenActionModules';
import humanize from '@good/helpers/humanize';
import nFormatter from '@good/helpers/nFormatter';
import { Modal, Tooltip } from '@good/ui';
import cn from '@good/ui/cn';
import { Leafwatch } from '@helpers/leafwatch';
import hasOptimisticallyCollected from '@helpers/optimistic/hasOptimisticallyCollected';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { RectangleStackIcon as RectangleStackIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import plur from 'plur';
import { useState } from 'react';

import CollectModule from './CollectModule';

interface OpenActionProps {
  publication: MirrorablePublication;
  showCount: boolean;
}

const OpenAction: FC<OpenActionProps> = ({ publication, showCount }) => {
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const openActions = publication.openActionModules.filter((module) =>
    allowedOpenActionModules.includes(module.type)
  );

  const hasActed =
    publication.operations.hasActed.value ||
    hasOptimisticallyCollected(publication.id);
  const { countOpenActions } = publication.stats;

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <div
        className={cn(
          hasActed ? 'text-brand-500' : 'ld-text-gray-500',
          'flex items-center space-x-1'
        )}
      >
        <motion.button
          aria-label="Action"
          className={cn(
            hasActed ? 'hover:bg-brand-300/20' : 'hover:bg-gray-300/20',
            'rounded-full p-1.5 outline-offset-2'
          )}
          onClick={() => {
            setShowOpenActionModal(true);
            Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT, {
              publication_id: publication.id
            });
          }}
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
            {hasActed ? (
              <RectangleStackIconSolid className={iconClassName} />
            ) : (
              <RectangleStackIcon className={iconClassName} />
            )}
          </Tooltip>
        </motion.button>
        {countOpenActions > 0 && !showCount ? (
          <span className="text-[11px] sm:text-xs">
            {nFormatter(countOpenActions)}
          </span>
        ) : null}
      </div>
      <Modal
        icon={<RectangleStackIcon className="size-5" />}
        onClose={() => setShowOpenActionModal(false)}
        show={showOpenActionModal}
        title="Open Actions"
      >
        {openActions?.map((action) => (
          <CollectModule
            key={action.type}
            openAction={action}
            publication={publication}
          />
        ))}
      </Modal>
    </>
  );
};

export default OpenAction;
