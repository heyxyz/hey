import { STATIC_IMAGES_URL } from '@hey/data/constants';
import getScore from '@hey/lib/api/getScore';
import humanize from '@hey/lib/humanize';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

import { MetaDetails } from './Details';

interface ScoreProps {
  id: string;
}

const Score: FC<ScoreProps> = ({ id }) => {
  const { setShowScoreModal } = useGlobalModalStateStore();

  const { data: score, isLoading } = useQuery({
    queryFn: () => getScore(id),
    queryKey: ['getScore', id]
  });

  if (isLoading || !score?.score) {
    return null;
  }

  return (
    <MetaDetails
      icon={
        <img className="size-4" src={`${STATIC_IMAGES_URL}/app-icon/2.png`} />
      }
    >
      <button
        className="font-mono text-xs font-bold"
        onClick={() => setShowScoreModal(true, score.score)}
      >
        {humanize(score.score)}
      </button>
    </MetaDetails>
  );
};

export default Score;
