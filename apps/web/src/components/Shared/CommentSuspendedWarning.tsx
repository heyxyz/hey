import type { FC } from 'react';

import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';

const CommentSuspendedWarning: FC = () => {
  return (
    <Card className="flex items-center space-x-1.5 border-red-300 !bg-red-100 p-5 text-sm font-bold text-gray-500">
      <NoSymbolIcon className="size-4 text-red-500" />
      <span>You are suspended from commenting</span>
    </Card>
  );
};

export default CommentSuspendedWarning;
