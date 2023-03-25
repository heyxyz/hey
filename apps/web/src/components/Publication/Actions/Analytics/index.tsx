import Beta from '@components/Shared/Badges/Beta';
import Loader from '@components/Shared/Loader';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { ChartBarIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { FeatureFlag } from 'data/feature-flags';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import isFeatureEnabled from 'lib/isFeatureEnabled';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { Modal, Tooltip } from 'ui';

const Stats = dynamic(() => import('./Stats'), {
  loading: () => <Loader message={t`Loading analytics`} />
});

interface AnalyticsProps {
  publication: Publication;
}

const Analytics: FC<AnalyticsProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const { allowed: staffMode } = useStaffMode();

  const isFullPublication = pathname === '/posts/[id]';
  const profileIdFromPublication = publication?.id.split('-')[0];
  const showAnalytics = currentProfile?.id === profileIdFromPublication;

  if (
    (!staffMode && (!showAnalytics || publication.__typename === 'Mirror')) ||
    isFeatureEnabled(FeatureFlag.PublicationAnalytics, currentProfile?.id)
  ) {
    return null;
  }

  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShowCollectModal(true);
        }}
        aria-label="Analytics"
      >
        <div className="flex items-center space-x-1 text-blue-500">
          <div className="rounded-full p-1.5 hover:bg-blue-300 hover:bg-opacity-20">
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
