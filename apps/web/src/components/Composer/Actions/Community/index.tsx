import Beta from '@components/Shared/Badges/Beta';
import { UserGroupIcon } from '@heroicons/react/outline';
import { FeatureFlag } from '@lenster/data/feature-flags';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { Modal, Tooltip } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';

import Choose from './Choose';

const CommunitySettings: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const isCommununitiesEnabled = isFeatureEnabled(FeatureFlag.Communities);

  if (!isCommununitiesEnabled) {
    return null;
  }

  return (
    <>
      <Tooltip placement="top" content={t`Select community`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowModal(!showModal)}
          aria-label="Select community"
        >
          <UserGroupIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span>
              <Trans>Choose community</Trans>
            </span>
            <Beta />
          </div>
        }
        icon={<UserGroupIcon className="text-brand h-5 w-5" />}
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Choose setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default CommunitySettings;
