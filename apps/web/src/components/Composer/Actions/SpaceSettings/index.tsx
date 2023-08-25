import { LockClosedIcon } from '@heroicons/react/outline';
import { Modal, Toggle, Tooltip } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';

import TokenGateForm from './TokenGateForm';

interface SpaceSettingsProps {
  children?: ReactNode;
}

const SpaceSettings: FC<SpaceSettingsProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const { isRecordingOn, setIsRecordingOn } = useSpacesStore();

  return (
    <div className="block items-center pt-3 sm:flex">
      <div className="flex gap-2 space-x-1">
        <Toggle
          on={isRecordingOn}
          setOn={() => setIsRecordingOn(!isRecordingOn)}
        />
        <div className="flex items-start text-sm text-neutral-400 dark:text-neutral-500">
          <Trans>Record Spaces</Trans>
        </div>
        <Tooltip placement="top" content={t`Token Gate Spaces`}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setShowModal(!showModal)}
            aria-label={t`Token Gate Spaces`}
          >
            <LockClosedIcon className="text-brand h-5 w-5" />
          </motion.button>
        </Tooltip>
        <Modal
          title={t`Token Gate Spaces`}
          icon={<LockClosedIcon className="text-brand h-5 w-5" />}
          show={showModal}
          onClose={() => setShowModal(false)}
        >
          <TokenGateForm setShowModal={setShowModal} />
        </Modal>
      </div>
      {children}
    </div>
  );
};

export default SpaceSettings;
