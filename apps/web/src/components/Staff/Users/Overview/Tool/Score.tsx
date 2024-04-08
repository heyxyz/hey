import type { FC } from 'react';

import { FireIcon } from '@heroicons/react/24/solid';
import getHeyScore from '@hey/lib/api/getHeyScore';
import humanize from '@hey/lib/humanize';
import { Button } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';

interface ScoreProps {
  address: string;
}

const Score: FC<ScoreProps> = ({ address }) => {
  const { data: heyScore, isLoading: heyScoreLoading } = useQuery({
    queryFn: () => getHeyScore(address, getAuthApiHeaders()),
    queryKey: ['getHeyScore', address]
  });

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <FireIcon className="size-5" />
        <div className="text-lg font-bold">Hey Score</div>
      </div>
      <div className="mt-3 space-y-2">
        {heyScoreLoading ? (
          'Loading...'
        ) : heyScore !== 0 ? (
          <div className="space-y-3">
            <div className="font-bold">{humanize(heyScore || 0)}</div>
            <Button className="text-xs" size="sm">
              Reset to 0
            </Button>
          </div>
        ) : (
          'Not scored'
        )}
      </div>
    </>
  );
};

export default Score;
