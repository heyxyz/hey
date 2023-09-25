import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { SETTINGS } from '@hey/data/tracking';
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
      axios.post(
        `${PREFERENCES_WORKER_URL}/update`,
        {
          id: currentProfile?.id,
          highSignalNotificationFilter: !highSignalNotificationFilter
        },
        {
          headers: {
            'X-Access-Token': localStorage.getItem(Localstorage.AccessToken)
          }
        }
      ),
      {
        loading: t`Updating preference settings...`,
        success: () => {
          setHighSignalNotificationFilter(!highSignalNotificationFilter);
          Leafwatch.track(
            SETTINGS.PREFERENCES.TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER,
            {
              enabled: !highSignalNotificationFilter
            }
          );

          return t`Notification preference updated`;
        },
        error: t`Error updating notification preference`
      }
    );
  };

  return (
    <ToggleWithHelper
      on={highSignalNotificationFilter}
      setOn={toggleHighSignalNotificationFilter}
      heading={t`Notification Signal filter`}
      description={t`Turn on high-signal notification filter`}
      icon={<SwatchIcon className="h-4 w-4" />}
    />
  );
};

export default HighSignalNotificationFilter;
