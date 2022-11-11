import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { LockClosedIcon } from '@heroicons/react/outline';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';

const AccessSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showModal, setShowModal] = useState(false);

  if (!isFeatureEnabled('access-settings', currentProfile?.id)) {
    return null;
  }

  return (
    <>
      <Tooltip placement="top" content="Access">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Leafwatch.track(PUBLICATION.NEW.ACCESS.OPEN_ACCESS_SETTINGS);
          }}
          aria-label="Access"
        >
          <LockClosedIcon className="h-5 w-5 text-brand" />
        </motion.button>
      </Tooltip>
      <Modal
        title="Access settings"
        icon={<LockClosedIcon className="w-5 h-5 text-brand" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        gm
      </Modal>
    </>
  );
};

export default AccessSettings;
