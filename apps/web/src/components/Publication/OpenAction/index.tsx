import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import allowedOpenActionModules from '@hey/helpers/allowedOpenActionModules';
import humanize from '@hey/helpers/humanize';
import nFormatter from '@hey/helpers/nFormatter';
import { Modal, Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import plur from 'plur';
import { useState } from 'react';

import CollectModule from './CollectModule';

interface OpenActionProps {
  publication: MirrorablePublication;
}

const OpenAction: FC<OpenActionProps> = ({ publication }) => {
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const openActions = publication.openActionModules.filter((module) =>
    allowedOpenActionModules.includes(module.type)
  );

  const { countOpenActions } = publication.stats;

  return (
    <>
      <div className="ld-text-gray-500 flex items-center space-x-1">
        <motion.button
          aria-label="Action"
          className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
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
            <RectangleStackIcon className="w-[15px] sm:w-[18px]" />
          </Tooltip>
        </motion.button>
        {countOpenActions > 0 ? (
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
