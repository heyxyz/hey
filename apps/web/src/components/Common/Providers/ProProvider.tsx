import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import getCurrentSession from '@lib/getCurrentSession';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProStore } from 'src/store/non-persisted/useProStore';

const ProProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setIsPro, setProExpiresAt } = useProStore();

  const fetchPro = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/pro/get`, {
        params: { id: sessionProfileId }
      });
      const { data } = response;
      setIsPro(data?.isPro);
      setProExpiresAt(data?.expiresAt);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: fetchPro,
    queryKey: ['fetchPro', sessionProfileId || '']
  });

  return null;
};

export default ProProvider;
