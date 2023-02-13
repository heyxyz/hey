import Loader from '@components/Shared/Loader';
import TipsOutlineIcon from '@components/Shared/TipIcons/TipsOutlineIcon';
import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { CollectionIcon } from '@heroicons/react/outline';
import { CollectionIcon as CollectionIconSolid } from '@heroicons/react/solid';
import { getModule } from '@lib/getModule';
import humanize from '@lib/humanize';
import { Leafwatch } from '@lib/leafwatch';
import nFormatter from '@lib/nFormatter';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { ElectedMirror, Publication } from 'lens';
import { CollectModules } from 'lens';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PUBLICATION } from 'src/tracking';

const CollectModule = dynamic(() => import('./CollectModule'), {
  loading: () => <Loader message={t`Loading collect`} />
});

const QuadraticModule = dynamic(() => import('./QuadraticModule'), {
  loading: () => <Loader message={t`Loading Tips`} />
});

interface Props {
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount: boolean;
}

const Collect: FC<Props> = ({ publication, electedMirror, showCount }) => {
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
  {
    /* {console.log('HAS COLLECTED: ', hasCollected)} */
  }
  {
    /* {console.log('Publication: ', publication)} */
  }
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
          {/* <div className="rounded-full p-1.5 hover:bg-red-300 hover:bg-opacity-20"> */}
          {isUnknownCollect ? (
            <div className="flex items-center">
              <div className="rounded-full p-1.5 hover:bg-red-300 hover:bg-opacity-20">
                <Tooltip
                  placement="top"
                  content={count > 0 ? `${humanize(count)} Total Tips by YOU!` : 'Quadratically Tip!'}
                  withDelay
                >
                  <div className="flex">{hasCollected ? <TipsSolidIcon /> : <TipsOutlineIcon />}</div>
                </Tooltip>
              </div>
              {hasCollected ? <p className="ml-2 text-center text-xs text-red-500">100 |</p> : null}
              <p className="ml-1 text-center text-xs text-red-500">9884</p>
            </div>
          ) : (
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
          )}
          {/* </div> */}
        </motion.button>
        {count > 0 && !showCount && <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>}
      </div>
      <Modal
        title={
          isFreeCollect
            ? t`Free Collect`
            : isUnknownCollect
            ? t`Tipping`
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
        {isUnknownCollect ? (
          <QuadraticModule
            electedMirror={electedMirror}
            publication={publication}
            count={count}
            setCount={setCount}
          />
        ) : (
          <CollectModule
            electedMirror={electedMirror}
            publication={publication}
            count={count}
            setCount={setCount}
          />
        )}
      </Modal>
    </>
  );
};

export default Collect;
