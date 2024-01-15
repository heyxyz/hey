import type { FC } from 'react';

import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { Modal, Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

import OpenActionsList from './OpenActionsList';

const OpenActionSettings: FC = () => {
  const { reset, setShowModal, showModal } = useOpenActionStore();

  return (
    <>
      <Tooltip content="Open Action" placement="top">
        <motion.button
          aria-label="Choose Open Action"
          className="outline-brand-500 rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <SquaresPlusIcon className="text-brand-500 size-5" />
        </motion.button>
      </Tooltip>
      <Modal
        icon={<SquaresPlusIcon className="text-brand-500 size-5" />}
        onClose={() => {
          setShowModal(false);
          reset();
        }}
        show={showModal}
        title="Open Action Settings"
      >
        <OpenActionsList />
      </Modal>
    </>
  );
};

export default OpenActionSettings;
