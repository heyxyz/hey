import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { Modal, Tooltip } from 'ui';

import CollectForm from './CollectForm';

const CollectSettings: FC = () => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);
  const reset = useCollectModuleStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content="Collect">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowModal(!showModal)}
          aria-label="Choose Collect Module"
        >
          <CollectionIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Modal
        title={t`Collect settings`}
        icon={<CollectionIcon className="text-brand h-5 w-5" />}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          reset();
        }}
      >
        <CollectForm setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default CollectSettings;
