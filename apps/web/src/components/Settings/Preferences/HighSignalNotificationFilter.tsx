import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import getPreferences from '@hey/lib/api/getPreferences';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

const HighSignalNotificationFilter: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const preferences = usePreferencesStore((state) => state.preferences);
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const [updating, setUpdating] = useState(false);

  const toggleHighSignalNotificationFilter = () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preference/updatePreferences`,
        {
          highSignalNotificationFilter:
            !preferences.highSignalNotificationFilter
        },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating notification preference';
        },
        loading: 'Updating preference settings...',
        success: () => {
          getPreferences(currentProfile?.id, getAuthWorkerHeaders());
          setUpdating(false);
          setPreferences({
            ...preferences,
            highSignalNotificationFilter:
              !preferences.highSignalNotificationFilter
          });
          Leafwatch.track(
            SETTINGS.PREFERENCES.TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER,
            {
              enabled: !preferences.highSignalNotificationFilter
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
      icon={<SwatchIcon className="size-4" />}
      on={preferences.highSignalNotificationFilter}
      setOn={toggleHighSignalNotificationFilter}
    />
  );
};

export default HighSignalNotificationFilter;
