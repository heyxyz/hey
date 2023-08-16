import { ACCESS_WORKER_URL } from '@lenster/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAccessStore } from 'src/store/access';
import { useAppPersistStore } from 'src/store/app';

const AccessProvider: FC = () => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const {
    setIsStaff,
    setIsGardener,
    setIsTrustedMember,
    setStaffMode,
    setGardenerMode
  } = useAccessStore();

  const fetchAccess = async () => {
    try {
      const response = await axios(`${ACCESS_WORKER_URL}/${profileId}`);
      const { data } = response;

      if (data.success) {
        setIsStaff(data.result.is_staff);
        setIsGardener(data.result.is_gardener);
        setIsTrustedMember(data.result.is_trusted_member);
        setStaffMode(data.result.staff_mode);
        setGardenerMode(data.result.gardener_mode);
      }
    } catch {}
  };

  useQuery(['access', profileId], () => fetchAccess(), {
    enabled: Boolean(profileId)
  });

  return null;
};

export default AccessProvider;
