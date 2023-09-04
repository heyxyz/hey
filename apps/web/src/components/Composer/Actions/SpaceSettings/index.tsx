import { LockClosedIcon } from '@heroicons/react/outline';
import { Modal, Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import React, { useState } from 'react';

import TokenGateForm from './TokenGateForm';

const SpaceSettings: FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
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
    </>
  );
};

export default SpaceSettings;
