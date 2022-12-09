import HelpTooltip from '@components/UI/HelpTooltip';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { LockClosedIcon } from '@heroicons/react/outline';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';

import BasicSettings from './BasicSettings';

const AccessSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const hasConditions = useAccessSettingsStore((state) => state.hasConditions);
  const reset = useAccessSettingsStore((state) => state.reset);
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
          <LockClosedIcon className={clsx(restricted ? 'text-green-500' : 'text-brand', 'h-5 w-5')} />
        </motion.button>
      </Tooltip>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span>Access settings</span>
            <HelpTooltip content="Add restrictions on who can view your content, and who can't. For instance - token gate your posts on the condition of owning specific NFTs or tokens." />
          </div>
        }
        icon={<LockClosedIcon className="w-5 h-5 text-brand" />}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          if (!hasConditions()) {
            reset();
          }
        }}
      >
        <BasicSettings />
      </Modal>
    </>
  );
};

export default AccessSettings;
