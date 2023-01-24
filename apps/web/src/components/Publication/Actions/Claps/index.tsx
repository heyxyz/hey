import Loader from '@components/Shared/Loader';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { Analytics } from '@lib/analytics';
import { getModule } from '@lib/getModule';
import humanize from '@lib/humanize';
import nFormatter from '@lib/nFormatter';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { ElectedMirror, Publication } from 'lens';
import { CollectModules } from 'lens';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PUBLICATION } from 'src/tracking';

import ClapsOutlineIcon from './ClapIcons/ClapsOutlineIcon';
import ClapsSolidIcon from './ClapIcons/ClapsSolidIcon';

const ClapsModule = dynamic(() => import('./ClapsModule'), {
  loading: () => <Loader message={t`Loading collect`} />
});

interface Props {
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount: boolean;
}

// const Claps: FC<Props> = ({ publication, electedMirror, showCount }) => {
const Claps: FC<Props> = ({ publication, electedMirror }) => {
  const [count, setCount] = useState(0);
  const [showClapsModal, setShowClapsModal] = useState(false);
  const isFreeCollect = publication?.collectModule.__typename === 'FreeCollectModuleSettings';
  const isUnknownCollect = publication?.collectModule.__typename === 'UnknownCollectModuleSettings';
  const isMirror = publication.__typename === 'Mirror';
  // const hasClapped = isMirror ? publication?.mirrorOf?.hasCollectedByMe : publication?.hasCollectedByMe;
  // alert - testing
  const hasClapped = true;

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

  // const iconClassName = hasClapped ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  // console.log(showCount, 'showCount')

  const baseClasses = 'flex items-center space-x-1 p-1 px-2 hover:bg-green-300 hover:bg-opacity-20';

  return (
    <div className="flex">
      <div
        className={`${baseClasses} ${
          hasClapped ? 'rounded-xl bg-green-300 bg-opacity-20 hover:bg-green-400' : 'rounded-xl'
        }`}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowClapsModal(true);
            Analytics.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
          }}
          aria-label="Clap"
        >
          <div>
            <Tooltip placement="top" content={count > 0 ? `${humanize(count)} Claps` : 'Clap'} withDelay>
              {hasClapped ? <ClapsSolidIcon size={14} /> : <ClapsOutlineIcon size={14} />}
            </Tooltip>
          </div>
        </motion.button>
        {count > 0 && <span className="font-size-14 text-green-500 ">{nFormatter(count)} +</span>}
      </div>

      <div className="font-size-14 text-green-500 place-self-center ml-2">- total claps</div>

      <Modal
        title={
          isFreeCollect
            ? t`Fund Quadratically`
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
        show={showClapsModal}
        onClose={() => setShowClapsModal(false)}
      >
        <ClapsModule
          electedMirror={electedMirror}
          publication={publication}
          count={count}
          setCount={setCount}
        />
      </Modal>
    </div>
  );
};

export default Claps;
