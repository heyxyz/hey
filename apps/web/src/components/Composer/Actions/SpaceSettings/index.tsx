import { CalendarIcon, LockClosedIcon } from '@heroicons/react/outline';
import { Modal, Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import React, { useState } from 'react';

import ScheduleSpacesForm from './ScheduleSpacesForm';
import TokenGateForm from './TokenGateForm';

interface SpaceSettingsProps {
  isLoading: boolean;
  createPublication: () => void;
}

const SpaceSettings: FC<SpaceSettingsProps> = ({
  isLoading,
  createPublication
}) => {
  const [showTokenGateModal, setShowTokenGateModal] = useState(false);
  const [showScheduleSpacesModal, setShowScheduleSpacesModal] = useState(false);

  return (
    <div className="flex gap-4">
      <Tooltip placement="top" content={t`Token Gate Spaces`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowTokenGateModal(!showTokenGateModal)}
          aria-label={t`Token Gate Spaces`}
        >
          <LockClosedIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Tooltip placement="top" content={t`Schedule Spaces`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowScheduleSpacesModal(!showScheduleSpacesModal)}
          aria-label={t`Schedule Spaces`}
        >
          <CalendarIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Modal
        title={t`Token Gate Spaces`}
        icon={<LockClosedIcon className="text-brand h-5 w-5" />}
        show={showTokenGateModal}
        onClose={() => setShowTokenGateModal(false)}
      >
        <TokenGateForm setShowModal={setShowTokenGateModal} />
      </Modal>

      <Modal
        title={t`Schedule Spaces`}
        icon={<CalendarIcon className="text-brand h-5 w-5" />}
        show={showScheduleSpacesModal}
        onClose={() => setShowScheduleSpacesModal(false)}
      >
        <ScheduleSpacesForm
          setShowModal={setShowScheduleSpacesModal}
          isLoading={isLoading}
          createPublication={createPublication}
        />
      </Modal>
    </div>
  );
};

export default SpaceSettings;
