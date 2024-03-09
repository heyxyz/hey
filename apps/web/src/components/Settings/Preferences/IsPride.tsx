import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

const IsPride: FC = () => {
  const { isPride, setIsPride } = usePreferencesStore();
  const [updating, setUpdating] = useState(false);

  const toggleIsPride = () => {
    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preferences/update`,
        { isPride: !isPride },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating pride preference';
        },
        loading: 'Updating pride preference...',
        success: () => {
          setUpdating(false);
          setIsPride(!isPride);
          Leafwatch.track(SETTINGS.PREFERENCES.TOGGLE_IS_PRIDE, {
            enabled: !isPride
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
      on={isPride}
      setOn={toggleIsPride}
    />
  );
};

export default IsPride;
