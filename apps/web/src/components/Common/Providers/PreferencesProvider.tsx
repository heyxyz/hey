import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

const PreferencesProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setVerifiedMembers = useAppStore((state) => state.setVerifiedMembers);
  const setIsLensMember = usePreferencesStore((state) => state.setIsLensMember);
  const setIsPride = usePreferencesStore((state) => state.setIsPride);
  const setHighSignalNotificationFilter = usePreferencesStore(
    (state) => state.setHighSignalNotificationFilter
  );
  const setLoadingPreferences = usePreferencesStore(
    (state) => state.setLoadingPreferences
  );

  const fetchPreferences = async () => {
    try {
      if (Boolean(currentSessionProfileId)) {
        const response = await axios.get(
          `${PREFERENCES_WORKER_URL}/getPreferences`,
          {
            params: { id: currentSessionProfileId }
          }
        );
        const { data } = response;

        setIsLensMember(data.result?.is_lens_member || false);
        setIsPride(data.result?.is_pride || false);
        setHighSignalNotificationFilter(
          data.result?.high_signal_notification_filter || false
        );
      }
    } catch {
    } finally {
      setLoadingPreferences(false);
    }
  };

  useQuery({
    queryKey: ['fetchPreferences', currentSessionProfileId || ''],
    queryFn: fetchPreferences
  });

  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios.get(`${PREFERENCES_WORKER_URL}/verified`);
      const { data } = response;
      setVerifiedMembers(data.result || []);
    } catch {}
  };

  useQuery({
    queryKey: ['fetchVerifiedMembers'],
    queryFn: fetchVerifiedMembers
  });

  return null;
};

export default PreferencesProvider;
