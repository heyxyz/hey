import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

const HighSignalNotificationFilter: FC = () => {
  const { highSignalNotificationFilter, setHighSignalNotificationFilter } =
    usePreferencesStore();
  const [updating, setUpdating] = useState(false);

  const toggleHighSignalNotificationFilter = () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preferences/update`,
        { highSignalNotificationFilter: !highSignalNotificationFilter },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating notification preference';
        },
        loading: 'Updating preference settings...',
        success: () => {
          setUpdating(false);
          setHighSignalNotificationFilter(!highSignalNotificationFilter);
          Leafwatch.track(
            SETTINGS.PREFERENCES.TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER,
            {
              enabled: !highSignalNotificationFilter
            }
          );

          return 'Notification preference updated';
        }
      }
    );
  };

  return (
    <ToggleWithHelper
      description="Turn on high-signal notification filter"
      disabled={updating}
      heading="Notification Signal filter"
      icon={<SwatchIcon className="size-5" />}
      on={highSignalNotificationFilter}
      setOn={toggleHighSignalNotificationFilter}
    />
  );
};

export default HighSignalNotificationFilter;
