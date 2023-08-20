import { PREFERENCES_WORKER_URL } from '@lenster/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAppPersistStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

const PreferencesProvider: FC = () => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const {
    setIsStaff,
    setIsGardener,
    setIsTrustedMember,
    setStaffMode,
    setGardenerMode,
    setVerifiedMembers,
    setHighSignalNotificationFilter
  } = usePreferencesStore();

  const fetchPreferences = async () => {
    try {
      const response = await axios(
        `${PREFERENCES_WORKER_URL}/preferences/${profileId}`
      );
      const { data } = response;

      setIsStaff(data.result?.is_staff || false);
      setIsGardener(data.result?.is_gardener || false);
      setIsTrustedMember(data.result?.is_trusted_member || false);
      setStaffMode(data.result?.staff_mode || false);
      setGardenerMode(data.result?.gardener_mode || false);
      setHighSignalNotificationFilter(
        data.result?.high_signal_notification_filter || false
      );
    } catch {}
  };

  useQuery(['preferences', profileId], () => fetchPreferences(), {
    enabled: Boolean(profileId)
  });

  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios(`${PREFERENCES_WORKER_URL}/verified`);
      const { data } = response;
      setVerifiedMembers(data.result || []);
    } catch {}
  };

  useQuery(['verifiedMembers'], () => fetchVerifiedMembers());

  return null;
};

export default PreferencesProvider;
