import type { FC } from 'react';

import Slug from '@components/Shared/Slug';
import { StarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';
import cn from '@hey/ui/cn';

interface CollectWarningProps {
  handle: string;
  isSuperFollow?: boolean | null;
}

const CollectWarning: FC<CollectWarningProps> = ({
  handle,
  isSuperFollow = false
}) => {
  return (
    <Card
      className={cn(
        { 'border-pink-300 !bg-pink-100': isSuperFollow },
        'flex items-center space-x-1.5 p-5 text-sm font-bold text-gray-500'
      )}
    >
      {isSuperFollow ? (
        <>
          <StarIcon className="size-4text-pink-500" />
          <span>Only </span>
          <Slug slug={`${handle}'s`} />
          <span className="text-pink-500"> super followers</span>
          <span> can collect</span>
        </>
      ) : (
        <>
          <UsersIcon className="text-brand-500 size-4" />
          <span>Only </span>
          <Slug slug={`${handle}'s`} />
          <span> followers can collect</span>
        </>
      )}
    </Card>
  );
};

export default CollectWarning;
