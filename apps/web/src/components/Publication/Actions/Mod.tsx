import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { ShieldCheckIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';

import ModAction from './ModAction';

interface Props {
  publication: Publication;
  isFullPublication?: boolean;
}

const Mod: FC<Props> = ({ publication, isFullPublication = false }) => {
  const [showModModal, setShowModModal] = useState(false);
  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowModModal(true)} aria-label="Mod">
        <div className="rounded-full p-1.5 text-yellow-600 hover:bg-yellow-400 hover:bg-opacity-20">
          <Tooltip placement="top" content="Mod actions" withDelay>
            <ShieldCheckIcon className={iconClassName} />
          </Tooltip>
        </div>
      </motion.button>
      <Modal
        show={showModModal}
        title={t`Mod actions`}
        icon={<ShieldCheckIcon className="text-brand-500 h-5 w-5" />}
        onClose={() => setShowModModal(false)}
      >
        <ModAction publication={publication} className="p-5" />
      </Modal>
    </>
  );
};

export default Mod;
