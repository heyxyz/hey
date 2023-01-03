import HelpTooltip from '@components/UI/HelpTooltip';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { LockClosedIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { PUBLICATION } from 'src/tracking';

import BasicSettings from './BasicSettings';

const AccessSettings: FC = () => {
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const hasConditions = useAccessSettingsStore((state) => state.hasConditions);
  const reset = useAccessSettingsStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);
  const { allowed: staffMode } = useStaffMode();

  if (!staffMode) {
    return null;
  }

  return (
    <>
      <Tooltip placement="top" content="Access">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Analytics.track(PUBLICATION.NEW.ACCESS.OPEN_ACCESS_SETTINGS);
          }}
          aria-label="Access"
        >
          <LockClosedIcon className={clsx(restricted ? 'text-green-500' : 'text-brand', 'h-5 w-5')} />
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
        icon={<LockClosedIcon className="w-5 h-5 text-brand" />}
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
