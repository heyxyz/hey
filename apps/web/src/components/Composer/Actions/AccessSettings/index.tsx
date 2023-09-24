import { LockClosedIcon } from '@heroicons/react/24/outline';
import { HelpTooltip, Modal, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { t, Trans } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';

import BasicSettings from './BasicSettings';

const AccessSettings: FC = () => {
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const hasConditions = useAccessSettingsStore((state) => state.hasConditions);
  const reset = useAccessSettingsStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content={t`Access`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowModal(!showModal)}
          aria-label="Access"
        >
          <LockClosedIcon
            className={cn(
              restricted ? 'text-green-500' : 'text-brand',
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
            <HelpTooltip>
              <Trans>
                Add restrictions on who can view your content, and who can't.
                For instance - token gate your posts on the condition of owning
                specific NFTs or tokens.
              </Trans>
            </HelpTooltip>
          </div>
        }
        icon={<LockClosedIcon className="text-brand h-5 w-5" />}
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
