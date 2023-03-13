import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { CashIcon } from '@heroicons/react/outline';
import { getModule } from '@lib/getModule';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';

import CollectForm from './CollectForm';

const CollectSettings: FC = () => {
  const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
  const reset = useCollectModuleStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content={getModule(selectedCollectModule).name}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowModal(!showModal)}
          aria-label="Choose Collect Module"
        >
          <div className="text-brand">
            <GetModuleIcon module={selectedCollectModule} size={5} />
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title={t`Collect settings`}
        icon={<CashIcon className="text-brand h-5 w-5" />}
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
