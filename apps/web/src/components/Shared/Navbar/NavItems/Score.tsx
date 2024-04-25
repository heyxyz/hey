import type { FC } from 'react';

import { DEFAULT_LOGO_URL } from '@hey/data/constants';
import humanize from '@hey/lib/humanize';
import cn from '@hey/ui/cn';
import { useScoreStore } from 'src/store/non-persisted/useScoreStore';

interface ScoreProps {
  className?: string;
  onClick?: () => void;
}

const Score: FC<ScoreProps> = ({ className = '', onClick }) => {
  const { score } = useScoreStore();

  return (
    <button
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => {
        onClick?.();
      }}
      type="button"
    >
      <img className="mr-0.5 size-3.5" src={DEFAULT_LOGO_URL} />
      <div>{humanize(score)}</div>
    </button>
  );
};

export default Score;
