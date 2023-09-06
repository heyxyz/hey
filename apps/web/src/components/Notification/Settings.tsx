import HighSignalNotificationFilter from '@components/Settings/Preferences/HighSignalNotificationFilter';
import { BellIcon, CogIcon } from '@heroicons/react/outline';
import { Modal, Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';

const Settings: FC = () => {
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  return (
    <>
      <button
        className="mx-3 rounded-md p-1 hover:bg-gray-300/20 sm:mx-0"
        onClick={() => setShowNotificationSettings(true)}
      >
        <Tooltip placement="top" content={t`Notification settings`}>
          <CogIcon className="lt-text-gray-500 h-5 w-5" />
        </Tooltip>
      </button>
      <Modal
        title="Notification settings"
        icon={<BellIcon className="text-brand h-5 w-5" />}
        show={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      >
        <div className="p-5">
          <HighSignalNotificationFilter />
        </div>
      </Modal>
    </>
  );
};

export default Settings;
