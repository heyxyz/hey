import type { FC } from 'react';

import getCurrentSession from '@helpers/getCurrentSession';
import getPro from '@hey/helpers/api/getPro';
import { useQuery } from '@tanstack/react-query';
import { useProStore } from 'src/store/non-persisted/useProStore';

const ProProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setIsPro, setProExpiresAt } = useProStore();

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: () =>
      getPro(sessionProfileId).then((data) => {
        setIsPro(data.isPro);
        setProExpiresAt(data.expiresAt);
        return data;
      }),
    queryKey: ['getPro', sessionProfileId || '']
  });

  return null;
};

export default ProProvider;
