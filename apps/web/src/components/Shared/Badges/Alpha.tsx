import type { FC } from 'react';

import { PuzzlePieceIcon } from '@heroicons/react/24/outline';

const Alpha: FC = () => {
  return (
    <span className="flex items-center space-x-1 rounded-md border border-red-600 bg-red-500 px-1.5 text-xs text-white shadow-sm">
      <PuzzlePieceIcon className="size-3" />
      <span>Alpha 🤫</span>
    </span>
  );
};

export default Alpha;
