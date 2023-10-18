import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { RectangleStackIcon as RectangleStackIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@hey/data/tracking';
import type { AnyPublication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Modal, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import plur from 'plur';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { create } from 'zustand';

import List from './List';

interface OpenActionState {
  actingPublicationConfig: {
    publicationId: string;
    countOpenActions: number;
  };
  setActingPublicationConfig: (actingPublicationConfig: {
    publicationId: string;
    countOpenActions: number;
  }) => void;
  getCountByPublicationId: (publicationId: string) => number;
}

export const useOpenActionStore = create<OpenActionState>((set, get) => ({
  actingPublicationConfig: {
    publicationId: '',
    countOpenActions: 0
  },
  setActingPublicationConfig: (actingPublicationConfig) =>
    set({ actingPublicationConfig }),
  getCountByPublicationId: (publicationId) => {
    const { actingPublicationConfig } = get();
    if (actingPublicationConfig.publicationId === publicationId) {
      return actingPublicationConfig.countOpenActions;
    }
    return 0;
  }
}));

interface OpenActionProps {
  publication: AnyPublication;
  showCount: boolean;
}

const OpenAction: FC<OpenActionProps> = ({ publication, showCount }) => {
  const { getCountByPublicationId, setActingPublicationConfig } =
    useOpenActionStore();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hasActed = targetPublication.operations.hasActed.value;
  const openActionCount = getCountByPublicationId(targetPublication.id);

  useEffect(() => {
    if (targetPublication.stats.countOpenActions) {
      setActingPublicationConfig({
        countOpenActions: targetPublication.stats.countOpenActions,
        publicationId: targetPublication.id
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <div
        className={cn(
          hasActed ? 'text-brand-500' : 'lt-text-gray-500',
          'flex items-center space-x-1'
        )}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowOpenActionModal(true);
            Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
          }}
          aria-label="Action"
        >
          <div
            className={cn(
              hasActed ? 'hover:bg-brand-300/20' : 'hover:bg-gray-300/20',
              'rounded-full p-1.5'
            )}
          >
            <Tooltip
              placement="top"
              content={`${humanize(openActionCount)} ${plur(
                'Action',
                openActionCount
              )}`}
              withDelay
            >
              {hasActed ? (
                <RectangleStackIconSolid className={iconClassName} />
              ) : (
                <RectangleStackIcon className={iconClassName} />
              )}
            </Tooltip>
          </div>
        </motion.button>
        {openActionCount > 0 && !showCount ? (
          <span className="text-[11px] sm:text-xs">
            {nFormatter(openActionCount)}
          </span>
        ) : null}
      </div>
      <Modal
        title="Collect"
        icon={<RectangleStackIcon className="text-brand h-5 w-5" />}
        show={showOpenActionModal}
        onClose={() => setShowOpenActionModal(false)}
      >
        <List publication={publication} />
      </Modal>
    </>
  );
};

export default OpenAction;
