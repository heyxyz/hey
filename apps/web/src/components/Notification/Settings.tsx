import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { BellIcon, CogIcon, ColorSwatchIcon } from '@heroicons/react/outline';
import { Modal, Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { usePreferencesStore } from 'src/store/preferences';

const Settings: FC = () => {
  const highSignalNotificationFilter = usePreferencesStore(
    (state) => state.highSignalNotificationFilter
  );
  const setHighSignalNotificationFilter = usePreferencesStore(
    (state) => state.setHighSignalNotificationFilter
  );
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  return (
    <>
      <button
        className="rounded-md p-1 hover:bg-gray-300/20"
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
          <ToggleWithHelper
            on={highSignalNotificationFilter}
            setOn={() => {
              setHighSignalNotificationFilter(!highSignalNotificationFilter);
            }}
            heading={t`Signal filter`}
            description={t`Turn on high-signal notification filter`}
            icon={<ColorSwatchIcon className="h-4 w-4" />}
          />
        </div>
      </Modal>
    </>
  );
};

export default Settings;
