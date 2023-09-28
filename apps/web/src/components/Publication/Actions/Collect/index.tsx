import Loader from '@components/Shared/Loader';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { RectangleStackIcon as RectangleStackIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@hey/data/tracking';
import type { ElectedMirror, Publication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { Modal, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
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
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount: boolean;
}

const Collect: FC<CollectProps> = ({
  publication,
  electedMirror,
  showCount
}) => {
  const [count, setCount] = useState(0);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const isMirror = publication.__typename === 'Mirror';
  const hasCollected = isMirror
    ? publication?.mirrorOf?.hasCollectedByMe
    : publication?.hasCollectedByMe;

  useEffect(() => {
    if (
      isMirror
        ? publication?.mirrorOf?.stats?.totalAmountOfCollects
        : publication?.stats?.totalAmountOfCollects
    ) {
      setCount(
        publication.__typename === 'Mirror'
          ? publication?.mirrorOf?.stats?.totalAmountOfCollects
          : publication?.stats?.totalAmountOfCollects
      );
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
          hasCollected ? 'text-brand-500' : 'lt-text-gray-500',
          'flex items-center space-x-1'
        )}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowCollectModal(true);
            Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
          }}
          aria-label="Collect"
        >
          <div
            className={cn(
              hasCollected ? 'hover:bg-brand-300/20' : 'hover:bg-gray-300/20',
              'rounded-full p-1.5'
            )}
          >
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
          electedMirror={electedMirror}
          publication={publication}
          count={count}
          setCount={setCount}
        />
      </Modal>
    </>
  );
};

export default Collect;
