import type { FC } from 'react';

import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { Modal, Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';

import CollectForm from './CollectForm';

const CollectSettings: FC = () => {
  const reset = useCollectModuleStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip content="Collect" placement="top">
        <motion.button
          aria-label="Choose Collect Module"
          className="outline-brand-500 rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <RectangleStackIcon className="text-brand-500 size-5" />
        </motion.button>
      </Tooltip>
      <Modal
        icon={<RectangleStackIcon className="text-brand-500 size-5" />}
        onClose={() => {
          setShowModal(false);
          reset();
        }}
        show={showModal}
        title="Collect settings"
      >
        <CollectForm setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default CollectSettings;
