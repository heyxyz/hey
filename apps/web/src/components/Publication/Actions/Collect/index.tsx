import Loader from '@components/Shared/Loader';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { CollectionIcon } from '@heroicons/react/outline';
import { CollectionIcon as CollectionIconSolid } from '@heroicons/react/solid';
import { getModule } from '@lib/getModule';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { ElectedMirror, Publication } from 'lens';
import { CollectModules } from 'lens';
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

const Collect: FC<CollectProps> = ({ publication, electedMirror, showCount }) => {
  const [count, setCount] = useState(0);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const isFreeCollect = publication?.collectModule.__typename === 'FreeCollectModuleSettings';
  const isUnknownCollect = publication?.collectModule.__typename === 'UnknownCollectModuleSettings';
  const isMirror = publication.__typename === 'Mirror';
  const hasCollected = isMirror ? publication?.mirrorOf?.hasCollectedByMe : publication?.hasCollectedByMe;

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

  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

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
          <div className="rounded-full p-1.5 hover:bg-red-300 hover:bg-opacity-20">
            <Tooltip
              placement="top"
              content={count > 0 ? `${humanize(count)} Collects` : 'Collect'}
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
        {count > 0 && !showCount && <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>}
      </div>
      <Modal
        title={
          isFreeCollect
            ? t`Free Collect`
            : isUnknownCollect
            ? t`Unknown Collect`
            : getModule(publication?.collectModule?.type).name
        }
        icon={
          <div className="text-brand">
            <GetModuleIcon
              module={isFreeCollect ? CollectModules.FreeCollectModule : publication?.collectModule?.type}
              size={5}
            />
          </div>
        }
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
