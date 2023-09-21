import Loader from '@components/Shared/Loader';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { RectangleStackIcon as RectangleStackIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@lenster/data/tracking';
import type { AnyPublication } from '@lenster/lens';
import humanize from '@lenster/lib/humanize';
import nFormatter from '@lenster/lib/nFormatter';
import { isMirrorPublication } from '@lenster/lib/publicationTypes';
import { Modal, Tooltip } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { plural, t } from '@lingui/macro';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

const CollectModule = dynamic(() => import('./CollectModule'), {
  loading: () => <Loader message={t`Loading collect`} />
});

interface CollectProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Collect: FC<CollectProps> = ({ publication, showCount }) => {
  const [count, setCount] = useState(0);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hasCollected = targetPublication.operations.hasActed;

  useEffect(() => {
    if (targetPublication.stats.countOpenActions) {
      setCount(targetPublication.stats.countOpenActions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <div className="flex items-center space-x-1 text-red-500">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowCollectModal(true);
            Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
          }}
          aria-label="Collect"
        >
          <div className="rounded-full p-1.5 hover:bg-red-300/20">
            <Tooltip
              placement="top"
              content={`${humanize(count)} ${plural(count, {
                zero: 'Collect',
                one: 'Collect',
                other: 'Collects'
              })}`}
              withDelay
            >
              {hasCollected ? (
                <RectangleStackIconSolid className={iconClassName} />
              ) : (
                <RectangleStackIcon className={iconClassName} />
              )}
            </Tooltip>
          </div>
        </motion.button>
        {count > 0 && !showCount ? (
          <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
        ) : null}
      </div>
      <Modal
        title={t`Collect`}
        icon={<RectangleStackIcon className="text-brand h-5 w-5" />}
        show={showCollectModal}
        onClose={() => setShowCollectModal(false)}
      >
        <CollectModule
          publication={publication}
          count={count}
          setCount={setCount}
        />
      </Modal>
    </>
  );
};

export default Collect;
