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
    setGardenerMode,
    setVerifiedMembers
  } = useAccessStore();

  const fetchAccess = async () => {
    try {
      const response = await axios(`${ACCESS_WORKER_URL}/rights/${profileId}`);
      const { data } = response;

      setIsStaff(data.result?.is_staff || false);
      setIsGardener(data.result?.is_gardener || false);
      setIsTrustedMember(data.result?.is_trusted_member || false);
      setStaffMode(data.result?.staff_mode || false);
      setGardenerMode(data.result?.gardener_mode || false);
    } catch {}
  };

  useQuery(['access', profileId], () => fetchAccess(), {
    enabled: Boolean(profileId)
  });

  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios(`${ACCESS_WORKER_URL}/verified`);
      const { data } = response;
      setVerifiedMembers(data.result || []);
    } catch {}
  };

  useQuery(['verifiedMembers'], () => fetchVerifiedMembers());

  return null;
};

export default AccessProvider;
