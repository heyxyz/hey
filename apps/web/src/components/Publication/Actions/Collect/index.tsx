import Loader from '@components/Shared/Loader';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import type { LensterPublication } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import { CollectionIcon as CollectionIconSolid } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import { getModule } from '@lib/getModule';
import humanize from '@lib/humanize';
import nFormatter from '@lib/nFormatter';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { ElectedMirror } from 'lens';
import { CollectModules } from 'lens';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PUBLICATION } from 'src/tracking';

const CollectModule = dynamic(() => import('./CollectModule'), {
  loading: () => <Loader message={t`Loading collect`} />
});

interface Props {
  publication: LensterPublication;
  electedMirror?: ElectedMirror;
}

const Collect: FC<Props> = ({ publication, electedMirror }) => {
  const { pathname } = useRouter();
  const [count, setCount] = useState(0);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const isFreeCollect = publication?.collectModule.__typename === 'FreeCollectModuleSettings';
  const isUnknownCollect = publication?.collectModule.__typename === 'UnknownCollectModuleSettings';
  const isFullPublication = pathname === '/posts/[id]';
  const isMirror = publication.__typename === 'Mirror';
  const hasCollected = isMirror ? publication?.mirrorOf?.hasCollectedByMe : publication?.hasCollectedByMe;

  useEffect(() => {
    if (publication?.mirrorOf?.stats?.totalAmountOfCollects || publication?.stats?.totalAmountOfCollects) {
      setCount(
        publication.__typename === 'Mirror'
          ? publication?.mirrorOf?.stats?.totalAmountOfCollects
          : publication?.stats?.totalAmountOfCollects
      );
    }
  }, [publication]);

  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <div className="text-red-500 flex items-center space-x-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowCollectModal(true);
            Analytics.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
          }}
          aria-label="Collect"
        >
          <div className="p-1.5 rounded-full hover:bg-red-300 hover:bg-opacity-20">
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
        {count > 0 && !isFullPublication && (
          <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
        )}
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
