import { HEY_API_URL } from '@hey/data/constants';
import getCurrentSession from '@lib/getCurrentSession';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useAppStore } from 'src/store/non-persisted/useAppStore';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { isAddress } from 'viem';

const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const setVerifiedMembers = useAppStore((state) => state.setVerifiedMembers);
  const setIsPride = usePreferencesStore((state) => state.setIsPride);
  const setHighSignalNotificationFilter = usePreferencesStore(
    (state) => state.setHighSignalNotificationFilter
  );
  const setLoadingPreferences = usePreferencesStore(
    (state) => state.setLoadingPreferences
  );
  const setPreferencesLoaded = usePreferencesStore(
    (state) => state.setPreferencesLoaded
  );

  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const response = await axios.get(
          `${HEY_API_URL}/preference/getPreferences`,
          { params: { id: sessionProfileId } }
        );
        const { data } = response;

        setPreferencesLoaded(true);
        setIsPride(data.result?.isPride || false);
        setHighSignalNotificationFilter(
          data.result?.highSignalNotificationFilter || false
        );
      }
    } catch {
    } finally {
      setLoadingPreferences(false);
    }
  };

  useQuery({
    queryKey: ['fetchPreferences', sessionProfileId || ''],
    queryFn: fetchPreferences
  });

  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/feature/getVerified`);
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
