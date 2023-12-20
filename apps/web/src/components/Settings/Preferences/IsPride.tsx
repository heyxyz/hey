import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import getPreferences from '@hey/lib/api/getPreferences';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

const IsPride: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const preferences = usePreferencesStore((state) => state.preferences);
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const [updating, setUpdating] = useState(false);

  const toggleIsPride = () => {
    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preference/updatePreferences`,
        { isPride: !preferences.isPride },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating pride preference';
        },
        loading: 'Updating pride preference...',
        success: () => {
          getPreferences(currentProfile?.id, getAuthWorkerHeaders());
          setUpdating(false);
          setPreferences({
            ...preferences,
            isPride: !preferences.isPride
          });
          Leafwatch.track(SETTINGS.PREFERENCES.TOGGLE_IS_PRIDE, {
            enabled: !preferences.isPride
          });

          return 'Pride preference updated';
        }
      }
    );
  };

  return (
    <ToggleWithHelper
      description={`Turn this on to show your pride and turn the ${APP_NAME} logo rainbow every day.`}
      disabled={updating}
      heading="Celebrate pride every day"
      icon={<img alt="Pride Logo" className="size-5" src="/pride.png" />}
      on={preferences.isPride}
      setOn={toggleIsPride}
    />
  );
};

export default IsPride;
