import { ACCESS_WORKER_URL } from '@lenster/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAccessStore } from 'src/store/access';
import { useAppPersistStore } from 'src/store/app';

const AccessProvider: FC = () => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const setIsStaff = useAccessStore((state) => state.setIsStaff);

  const fetchAccess = async () => {
    try {
      const response = await axios(`${ACCESS_WORKER_URL}/${profileId}`);
      const { data } = response;

      if (data.success) {
        setIsStaff(data.result.isStaff);
      }
    } catch (error) {
      setIsStaff(false);
    }
  };

  useQuery(['access', profileId], () => fetchAccess());

  return null;
};

export default AccessProvider;
