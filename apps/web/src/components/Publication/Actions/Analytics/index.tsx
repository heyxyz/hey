import Beta from '@components/Shared/Badges/Beta';
import Loader from '@components/Shared/Loader';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { ChartBarIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

const Stats = dynamic(() => import('./Stats'), {
  loading: () => <Loader message={t`Loading analytics`} />
});

interface Props {
  publication: Publication;
}

const Analytics: FC<Props> = ({ publication }) => {
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const { allowed: staffMode } = useStaffMode();

  const isFullPublication = pathname === '/posts/[id]';
  const profileIdFromPublication = publication?.id.split('-')[0];
  const showAnalytics = currentProfile?.id === profileIdFromPublication;

  if (!staffMode && (!showAnalytics || publication.__typename === 'Mirror')) {
    return null;
  }

  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShowCollectModal(true);
          // Analytics.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
        }}
        aria-label="Analytics"
      >
        <div className="flex items-center space-x-1 text-blue-500">
          <div className="p-1.5 rounded-full hover:bg-blue-300 hover:bg-opacity-20">
            <Tooltip placement="top" content="Analytics" withDelay>
              <ChartBarIcon className={iconClassName} />
            </Tooltip>
          </div>
        </div>
      </motion.button>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span>{t`Publication Analytics`}</span>
            <Beta />
          </div>
        }
        icon={<ChartBarIcon className="text-brand h-5 w-5" />}
        show={showCollectModal}
        onClose={() => setShowCollectModal(false)}
      >
        <Stats publication={publication} />
      </Modal>
    </>
  );
};

export default Analytics;
