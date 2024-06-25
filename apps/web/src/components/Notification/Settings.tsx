import type { FC } from 'react';

import HighSignalNotificationFilter from '@components/Settings/Preferences/HighSignalNotificationFilter';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Modal, Tooltip } from '@hey/ui';
import { useState } from 'react';

const Settings: FC = () => {
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  const handleOpenSettings = () => setShowNotificationSettings(true);
  const handleCloseSettings = () => setShowNotificationSettings(false);

  return (
    <>
      <button
        className="mx-3 rounded-md p-1 hover:bg-gray-300/20 sm:mx-0"
        onClick={handleOpenSettings}
        type="button"
      >
        <Tooltip content="Notification settings" placement="top">
          <Cog6ToothIcon className="ld-text-gray-500 size-5" />
        </Tooltip>
      </button>
      <Modal
        icon={<BellIcon className="size-5" />}
        onClose={handleCloseSettings}
        show={showNotificationSettings}
        title="Notification settings"
      >
        <div className="p-5">
          <HighSignalNotificationFilter />
        </div>
      </Modal>
    </>
  );
};

export default Settings;
