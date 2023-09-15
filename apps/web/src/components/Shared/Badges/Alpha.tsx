import { PuzzlePieceIcon } from '@heroicons/react/24/outline';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const Alpha: FC = () => {
  return (
    <div className="flex items-center space-x-1 rounded-md border border-red-600 bg-red-500 px-1.5 text-xs text-white shadow-sm">
      <PuzzlePieceIcon className="h-3 w-3" />
      <div>
        <Trans>Alpha 🤫</Trans>
      </div>
    </div>
  );
};

export default Alpha;
