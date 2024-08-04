import type { FC } from 'react';

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Modal, Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { usePublicationLicenseStore } from 'src/store/non-persisted/publication/usePublicationLicenseStore';

import CollectForm from './CollectForm';

const CollectSettings: FC = () => {
  const { reset } = useCollectModuleStore((state) => state);
  const { setLicense } = usePublicationLicenseStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip content="Collect" placement="top">
        <motion.button
          aria-label="Collect Module"
          className="rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingBagIcon className="size-5" />
        </motion.button>
      </Tooltip>
      <Modal
        icon={<ShoppingBagIcon className="size-5" />}
        onClose={() => {
          setShowModal(false);
          setLicense(null);
          reset();
        }}
        show={showModal}
        title="Collect Settings"
      >
        <CollectForm setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default CollectSettings;
