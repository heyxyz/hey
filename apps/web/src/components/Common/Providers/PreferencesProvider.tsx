import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

const PreferencesProvider: FC = () => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const setVerifiedMembers = useAppStore((state) => state.setVerifiedMembers);
  const {
    setIsStaff,
    setIsGardener,
    setIsLensMember,
    setStaffMode,
    setGardenerMode,
    setIsPride,
    setHighSignalNotificationFilter,
    setLoadingPreferences
  } = usePreferencesStore();

  const fetchPreferences = async () => {
    try {
      if (Boolean(profileId)) {
        const response = await axios.get(
          `${PREFERENCES_WORKER_URL}/get/${profileId}`
        );
        const { data } = response;

        setIsStaff(data.result?.is_staff || false);
        setIsGardener(data.result?.is_gardener || false);
        setIsLensMember(data.result?.is_lens_member || false);
        setStaffMode(data.result?.staff_mode || false);
        setGardenerMode(data.result?.gardener_mode || false);
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

  useQuery(['preferences', profileId], () => fetchPreferences());

  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios.get(`${PREFERENCES_WORKER_URL}/verified`);
      const { data } = response;
      setVerifiedMembers(data.result || []);
    } catch {}
  };

  useQuery(['verifiedMembers'], () => fetchVerifiedMembers());

  return null;
};

export default PreferencesProvider;
