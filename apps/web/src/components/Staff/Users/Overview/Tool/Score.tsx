import { FireIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import getHeyScore from '@hey/lib/api/getHeyScore';
import humanize from '@hey/lib/humanize';
import { Button } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';

interface ScoreProps {
  address: string;
}

const Score: FC<ScoreProps> = ({ address }) => {
  const [heyScore, setHeyScore] = useState(0);
  const [resetting, setResetting] = useState(false);

  const { isLoading: heyScoreLoading } = useQuery({
    queryFn: () =>
      getHeyScore(address, getAuthApiHeaders(), true).then((score) =>
        setHeyScore(score)
      ),
    queryKey: ['getHeyScore', address]
  });

  const reset = async () => {
    try {
      setResetting(true);
      await axios.post(
        `${HEY_API_URL}/internal/score/reset`,
        { address, availabePoints: heyScore },
        { headers: getAuthApiHeaders() }
      );
      setHeyScore(0);
    } catch (error) {
      errorToast(error);
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <FireIcon className="size-5" />
        <div className="text-lg font-bold">Hey Score</div>
      </div>
      <div className="mt-3 space-y-3">
        {heyScoreLoading ? (
          <div>Loading...</div>
        ) : heyScore !== 0 ? (
          <div className="font-bold">{humanize(heyScore || 0)}</div>
        ) : (
          <div>Not scored</div>
        )}
        {!heyScoreLoading && (
          <Button
            className="text-xs"
            disabled={resetting}
            onClick={reset}
            size="sm"
          >
            Reset to 0
          </Button>
        )}
      </div>
    </>
  );
};

export default Score;
