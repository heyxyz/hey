import type { FC } from 'react';

import { Badge } from '@good/ui';
import { PuzzlePieceIcon } from '@heroicons/react/24/outline';

const Alpha: FC = () => {
  return (
    <Badge className="flex items-center space-x-1" variant="danger">
      <PuzzlePieceIcon className="size-3" />
      <span>Alpha 🤫</span>
    </Badge>
  );
};

export default Alpha;
