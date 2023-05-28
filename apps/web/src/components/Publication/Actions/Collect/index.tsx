import Loader from '@components/Shared/Loader';
import { CollectionIcon } from '@heroicons/react/outline';
import { CollectionIcon as CollectionIconSolid } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/leafwatch';
import { plural, t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { ElectedMirror, Publication } from 'lens';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PUBLICATION } from 'src/tracking';
import { Modal, Tooltip } from 'ui';

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
      <div className="flex items-center space-x-1 text-red-500">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowCollectModal(true);
            Mixpanel.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
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
                <CollectionIconSolid className={iconClassName} />
              ) : (
                <CollectionIcon className={iconClassName} />
              )}
            </Tooltip>
          </div>
        </motion.button>
        {count > 0 && !showCount && (
          <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
        )}
      </div>
      <Modal
        title={t`Collect`}
        icon={<CollectionIcon className="text-brand h-5 w-5" />}
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
