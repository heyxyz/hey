import type { FC } from 'react';

import Slug from '@components/Shared/Slug';
import { UsersIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';

interface CollectWarningProps {
  handle: string;
}

const CollectWarning: FC<CollectWarningProps> = ({ handle }) => {
  return (
    <Card
      className="flex items-center space-x-1.5 p-5 text-sm font-bold text-gray-500"
      forceRounded
    >
      <UsersIcon className="size-4" />
      <span>Only </span>
      <Slug slug={`${handle}'s`} />
      <span> followers can collect</span>
    </Card>
  );
};

export default CollectWarning;
