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
  openActionPublicationConfig: {
    publicationId: string;
    countOpenActions: number;
    acted: boolean;
  };
  setOpenActionPublicationConfig: (openActionPublicationConfig: {
    publicationId: string;
    countOpenActions: number;
    acted: boolean;
  }) => void;
  getOpenActionCountByPublicationId: (publicationId: string) => number;
  hasActedByMe: (publicationId: string) => boolean;
}

export const useOpenActionStore = create<OpenActionState>((set, get) => ({
  openActionPublicationConfig: {
    publicationId: '',
    countOpenActions: 0,
    acted: false
  },
  setOpenActionPublicationConfig: (openActionPublicationConfig) =>
    set({ openActionPublicationConfig }),
  getOpenActionCountByPublicationId: (publicationId) => {
    const { openActionPublicationConfig } = get();
    if (openActionPublicationConfig.publicationId === publicationId) {
      return openActionPublicationConfig.countOpenActions;
    }
    return 0;
  },
  hasActedByMe: (publicationId) => {
    const { openActionPublicationConfig } = get();
    if (openActionPublicationConfig.publicationId === publicationId) {
      return openActionPublicationConfig.acted;
    }
    return false;
  }
}));

interface OpenActionProps {
  publication: AnyPublication;
  showCount: boolean;
}

const OpenAction: FC<OpenActionProps> = ({ publication, showCount }) => {
  const {
    getOpenActionCountByPublicationId,
    hasActedByMe,
    setOpenActionPublicationConfig
  } = useOpenActionStore();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hasActed = hasActedByMe(targetPublication.id);
  const openActionCount = getOpenActionCountByPublicationId(
    targetPublication.id
  );

  useEffect(() => {
    if (targetPublication.stats.countOpenActions) {
      setOpenActionPublicationConfig({
        countOpenActions: targetPublication.stats.countOpenActions,
        publicationId: targetPublication.id,
        acted: targetPublication.operations.hasActed.value
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
