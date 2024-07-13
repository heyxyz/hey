import type { FC } from 'react';

import { STALE_TIMES } from '@hey/data/constants';
import getPro from '@hey/helpers/api/getPro';
import { useQuery } from '@tanstack/react-query';
import useLensAuthData from 'src/hooks/useLensAuthData';
import { useProStore } from 'src/store/non-persisted/useProStore';

const ProProvider: FC = () => {
  const { setIsPro, setProExpiresAt } = useProStore();
  const { id: sessionProfileId } = useLensAuthData();

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: () =>
      getPro(sessionProfileId as string).then((data) => {
        setIsPro(data.isPro);
        setProExpiresAt(data.expiresAt);
        return data;
      }),
    queryKey: ['getPro', sessionProfileId || ''],
    staleTime: STALE_TIMES.THIRTY_MINUTES
  });

  return null;
};

export default ProProvider;
