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

import TipsOutlineIcon from '../../../Composer/Actions/TipIcons/TipsOutlineIcon';
import TipsSolidIcon from '../../../Composer/Actions/TipIcons/TipsSolidIcon';

const TipsModule = dynamic(() => import('./TipsModule'), {
  loading: () => <Loader message={t`Loading Tips Module`} />
});

interface Props {
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount: boolean;
}

// const Votes: FC<Props> = ({ publication, electedMirror, showCount }) => {
const Tips: FC<Props> = ({ publication, electedMirror }) => {
  const [count, setCount] = useState(0);
  const [showTipModal, setShowTipModal] = useState(false);
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

  const baseClasses =
    'flex justify-center items-center space-x-1 p-1 px-2 hover:bg-green-300 hover:bg-opacity-20';

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
            setShowTipModal(true);
            Analytics.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
          }}
          aria-label="Clap"
        >
          <div>
            <Tooltip
              placement="top"
              content={count > 0 ? `${humanize(count)} Tips` : 'Tip quadratically!'}
              withDelay
            >
              {hasClapped ? <TipsSolidIcon size={18} /> : <TipsOutlineIcon size={20} />}
            </Tooltip>
          </div>
        </motion.button>
        {count > 0 && <span className="font-size-14 text-green-500 ">{nFormatter(count)} +</span>}
      </div>

      <div className="font-size-14 ml-2 place-self-center text-green-500"> - total tips placeholder</div>

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
        show={showTipModal}
        onClose={() => setShowTipModal(false)}
      >
        <TipsModule
          electedMirror={electedMirror}
          publication={publication}
          count={count}
          setCount={setCount}
        />
      </Modal>
    </div>
  );
};

export default Tips;
