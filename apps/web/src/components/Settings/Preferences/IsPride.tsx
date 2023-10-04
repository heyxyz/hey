import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { APP_NAME, PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { SETTINGS } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

const IsPride: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isPride = usePreferencesStore((state) => state.isPride);
  const setIsPride = usePreferencesStore((state) => state.setIsPride);

  const toggleIsPride = () => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/update`,
        {
          id: currentProfile?.id,
          isPride: !isPride
        },
        {
          headers: {
            'X-Access-Token': localStorage.getItem(Localstorage.AccessToken)
          }
        }
      ),
      {
        loading: t`Updating pride preference...`,
        success: () => {
          setIsPride(!isPride);
          Leafwatch.track(SETTINGS.PREFERENCES.TOGGLE_IS_PRIDE, {
            enabled: !isPride
          });

          return t`Pride preference updated`;
        },
        error: t`Error updating pride preference`
      }
    );
  };

  return (
    <ToggleWithHelper
      on={isPride}
      setOn={toggleIsPride}
      heading={t`Celebrate pride every day`}
      description={t`Turn this on to show your pride and turn the ${APP_NAME} logo rainbow every day.`}
      icon={<img className="h-5 w-5" src="/pride.png" alt="Pride Logo" />}
    />
  );
};

export default IsPride;
