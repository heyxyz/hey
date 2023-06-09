import Loader from '@components/Shared/Loader';
import TipsOutlineIcon from '@components/Shared/TipIcons/TipsOutlineIcon';
import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { ElectedMirror, Publication } from 'lens';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import React, { useState } from 'react';
import { Modal, Tooltip } from 'ui';

const Tipping = dynamic(() => import('./Tipping'), {
  loading: () => <Loader message={t`Loading collect`} />
});
interface CollectProps {
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount: boolean;
}

const Tip: FC<CollectProps> = ({ publication, electedMirror, showCount }) => {
  const [count, setCount] = useState(0);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const isMirror = publication.__typename === 'Mirror';
  const hasCollected = isMirror ? publication?.mirrorOf?.hasCollectedByMe : publication?.hasCollectedByMe;

  return (
    <>
      <div className="flex items-center space-x-1 text-red-500">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowCollectModal(true);
          }}
          aria-label="Collect"
        >
          <div className="flex items-center">
            <div className="rounded-full p-1.5 hover:bg-red-300 hover:bg-opacity-20">
              <Tooltip
                placement="top"
                content={count > 0 ? `${humanize(count)} Total Tips by YOU!` : 'Quadratically Tip!'}
                withDelay
              >
                <div className="flex">
                  {hasCollected ? <TipsSolidIcon /> : <TipsOutlineIcon color="black" />}
                </div>
              </Tooltip>
            </div>
          </div>
        </motion.button>
        {count > 0 && <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>}
      </div>
      <Modal
        title={t`Quadratic Tipping`}
        icon={
          <div className="text-brand">
            <TipsOutlineIcon color="#8B5CF6" />
          </div>
        }
        show={showCollectModal}
        onClose={() => setShowCollectModal(false)}
      >
        <Tipping
          electedMirror={electedMirror}
          publication={publication}
          count={count}
          setCount={setCount}
          setShowCollectModal={setShowCollectModal}
        />
      </Modal>
    </>
  );
};

export default Tip;
