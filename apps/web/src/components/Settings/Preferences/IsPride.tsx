import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import {
  APP_NAME,
  IS_MAINNET,
  PREFERENCES_WORKER_URL
} from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { SETTINGS } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

const IsPride: FC = () => {
  const isPride = usePreferencesStore((state) => state.isPride);
  const setIsPride = usePreferencesStore((state) => state.setIsPride);

  const toggleIsPride = () => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/update`,
        { isPride: !isPride },
        {
          headers: {
            'X-Access-Token': localStorage.getItem(Localstorage.AccessToken),
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'testnet'
          }
        }
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
