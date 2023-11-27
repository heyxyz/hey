import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from '@store/non-persisted/usePreferencesStore';

const IsPride: FC = () => {
  const isPride = usePreferencesStore((state) => state.isPride);
  const setIsPride = usePreferencesStore((state) => state.setIsPride);

  const toggleIsPride = () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preference/updatePreferences`,
        { isPride: !isPride },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Updating pride preference...',
        success: () => {
          setIsPride(!isPride);
          Leafwatch.track(SETTINGS.PREFERENCES.TOGGLE_IS_PRIDE, {
            enabled: !isPride
          });

          return 'Pride preference updated';
        },
        error: 'Error updating pride preference'
      }
    );
  };

  return (
    <ToggleWithHelper
      on={isPride}
      setOn={toggleIsPride}
      heading="Celebrate pride every day"
      description={`Turn this on to show your pride and turn the ${APP_NAME} logo rainbow every day.`}
      icon={<img className="h-5 w-5" src="/pride.png" alt="Pride Logo" />}
    />
  );
};

export default IsPride;
