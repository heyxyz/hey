import { LockClosedIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { HelpTooltip, Modal, Tooltip } from 'ui';

import BasicSettings from './BasicSettings';

const AccessSettings: FC = () => {
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const hasConditions = useAccessSettingsStore((state) => state.hasConditions);
  const reset = useAccessSettingsStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content="Access">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowModal(!showModal)}
          aria-label="Access"
        >
          <LockClosedIcon
            className={clsx(
              restricted ? 'text-green-500' : 'text-brand-600 dark:text-brand-400/80',
              'h-5 w-5'
            )}
          />
        </motion.button>
      </Tooltip>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span>
              <Trans>Access settings</Trans>
            </span>
            <HelpTooltip
              content={t`Add restrictions on who can view your content, and who can't. For instance - token gate your posts on the condition of owning specific NFTs or tokens.`}
            />
          </div>
        }
        icon={<LockClosedIcon className="text-brand-600 dark:text-brand-400/80 h-5 w-5" />}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          if (!hasConditions()) {
            reset();
          }
        }}
      >
        <BasicSettings setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default AccessSettings;
