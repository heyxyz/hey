import type { FC } from 'react';

import getScore from '@hey/lib/api/getScore';
import { useQuery } from '@tanstack/react-query';

interface LoadScoreProps {
  profileId: string;
}

const LoadScore: FC<LoadScoreProps> = ({ profileId }) => {
  useQuery({
    queryFn: () => getScore(profileId),
    queryKey: ['getScore', profileId]
  });

  return null;
};

export default LoadScore;
