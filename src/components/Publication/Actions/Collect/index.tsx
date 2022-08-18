import Loader from '@components/Shared/Loader';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { LensterPublication } from '@generated/lenstertypes';
import { CollectionIcon } from '@heroicons/react/outline';
import { CollectionIcon as CollectionIconSolid } from '@heroicons/react/solid';
import { getModule } from '@lib/getModule';
import humanize from '@lib/humanize';
import { Mixpanel } from '@lib/mixpanel';
import nFormatter from '@lib/nFormatter';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FC, useEffect, useState } from 'react';
import { PUBLICATION } from 'src/tracking';

const CollectModule = dynamic(() => import('./CollectModule'), {
  loading: () => <Loader message="Loading collect" />
});

interface Props {
  publication: LensterPublication;
}

const Collect: FC<Props> = ({ publication }) => {
  const [count, setCount] = useState(0);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const isFreeCollect = publication?.collectModule?.__typename === 'FreeCollectModuleSettings';
  const isMirror = publication?.__typename === 'Mirror';
  const hasCollected = isMirror ? publication?.mirrorOf?.hasCollectedByMe : publication?.hasCollectedByMe;

  useEffect(() => {
    if (publication?.mirrorOf?.stats?.totalAmountOfCollects || publication?.stats?.totalAmountOfCollects) {
      setCount(
        publication.__typename === 'Mirror'
          ? publication?.mirrorOf?.stats?.totalAmountOfCollects
          : publication?.stats?.totalAmountOfCollects
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShowCollectModal(true);
          Mixpanel.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
        }}
        aria-label="Collect"
      >
        <div className="flex items-center space-x-1 text-red-500 hover:red-brand-400">
          <div className="p-1.5 rounded-full hover:bg-red-300 hover:bg-opacity-20">
            <Tooltip
              placement="top"
              content={count > 0 ? `${humanize(count)} Collects` : 'Collect'}
              withDelay
            >
              {hasCollected ? (
                <CollectionIconSolid className="w-[15px] sm:w-[18px]" />
              ) : (
                <CollectionIcon className="w-[15px] sm:w-[18px]" />
              )}
            </Tooltip>
          </div>
          {count > 0 && <div className="text-[11px] sm:text-xs">{nFormatter(count)}</div>}
        </div>
      </motion.button>
      <Modal
        title={isFreeCollect ? 'Free Collect' : getModule(publication?.collectModule?.type).name}
        icon={
          <div className="text-brand">
            <GetModuleIcon
              module={isFreeCollect ? 'FreeCollectModule' : publication?.collectModule?.type}
              size={5}
            />
          </div>
        }
        show={showCollectModal}
        onClose={() => setShowCollectModal(false)}
      >
        <CollectModule publication={publication} count={count} setCount={setCount} />
      </Modal>
    </>
  );
};

export default Collect;
