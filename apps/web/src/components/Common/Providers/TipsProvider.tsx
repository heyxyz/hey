import type { FC } from 'react';

import { TIP_API_URL } from '@hey/data/constants';
import getCurrentSession from '@lib/getCurrentSession';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTipsStore } from 'src/store/non-persisted/useTipsStore';

const TipsProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setAllowance } = useTipsStore();

  const fetchTipsAllowance = async () => {
    try {
      const response = await axios.get(`${TIP_API_URL}/profile`, {
        params: { profileId: sessionProfileId }
      });
      const { data } = response;
      setAllowance(data?.allowance || null);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: fetchTipsAllowance,
    queryKey: ['fetchTipsAllowance', sessionProfileId || '']
  });

  return null;
};

export default TipsProvider;
