import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { IS_MAINNET, PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { SETTINGS } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/preferences';

const HighSignalNotificationFilter: FC = () => {
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
        { highSignalNotificationFilter: !highSignalNotificationFilter },
        {
          headers: {
            'X-Access-Token': localStorage.getItem(Localstorage.AccessToken),
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'testnet'
          }
        }
      ),
      {
        loading: 'Updating preference settings...',
        success: () => {
          setHighSignalNotificationFilter(!highSignalNotificationFilter);
          Leafwatch.track(
            SETTINGS.PREFERENCES.TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER,
            {
              enabled: !highSignalNotificationFilter
            }
          );

          return 'Notification preference updated';
        },
        error: 'Error updating notification preference'
      }
    );
  };

  return (
    <ToggleWithHelper
      on={highSignalNotificationFilter}
      setOn={toggleHighSignalNotificationFilter}
      heading="Notification Signal filter"
      description="Turn on high-signal notification filter"
      icon={<SwatchIcon className="h-4 w-4" />}
    />
  );
};

export default HighSignalNotificationFilter;
