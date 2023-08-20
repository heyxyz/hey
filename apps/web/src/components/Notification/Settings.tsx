import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { BellIcon, CogIcon, ColorSwatchIcon } from '@heroicons/react/outline';
import { PREFERENCES_WORKER_URL } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import { NOTIFICATION } from '@lenster/data/tracking';
import { Modal, Tooltip } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

const Settings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const highSignalNotificationFilter = usePreferencesStore(
    (state) => state.highSignalNotificationFilter
  );
  const setHighSignalNotificationFilter = usePreferencesStore(
    (state) => state.setHighSignalNotificationFilter
  );
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  const toggleHighSignalNotificationFilter = () => {
    toast.promise(
      axios.post(`${PREFERENCES_WORKER_URL}/update`, {
        id: currentProfile?.id,
        highSignalNotificationFilter: !highSignalNotificationFilter,
        accessToken: localStorage.getItem(Localstorage.AccessToken)
      }),
      {
        loading: t`Updating notification settings...`,
        success: () => {
          setHighSignalNotificationFilter(!highSignalNotificationFilter);
          Leafwatch.track(NOTIFICATION.TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER);

          return t`Notification settings updated`;
        },
        error: t`Error updating notification settings`
      }
    );
  };

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
            setOn={toggleHighSignalNotificationFilter}
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
