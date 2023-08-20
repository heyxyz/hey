import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ColorSwatchIcon } from '@heroicons/react/outline';
import { PREFERENCES_WORKER_URL } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import { NOTIFICATION } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

const HighSignalNotificationFilter: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const highSignalNotificationFilter = usePreferencesStore(
    (state) => state.highSignalNotificationFilter
  );
  const setHighSignalNotificationFilter = usePreferencesStore(
    (state) => state.setHighSignalNotificationFilter
  );

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
    <ToggleWithHelper
      on={highSignalNotificationFilter}
      setOn={toggleHighSignalNotificationFilter}
      heading={t`Notification Signal filter`}
      description={t`Turn on high-signal notification filter`}
      icon={<ColorSwatchIcon className="h-4 w-4" />}
    />
  );
};

export default HighSignalNotificationFilter;
