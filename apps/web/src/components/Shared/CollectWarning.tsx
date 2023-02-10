import Slug from '@components/Shared/Slug';
import { Card } from '@components/UI/Card';
import { StarIcon, UsersIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { FC } from 'react';

interface Props {
  handle: string;
  isSuperFollow?: boolean | null;
}

const CollectWarning: FC<Props> = ({ handle, isSuperFollow = false }) => {
  return (
    <Card
      className={clsx(
        { 'border-pink-300 !bg-pink-100': isSuperFollow },
        'flex items-center space-x-1.5 p-5 text-sm font-bold text-gray-500'
      )}
    >
      {isSuperFollow ? (
        <>
          <StarIcon className="h-4 w-4 text-pink-500" />
          <span>Only </span>
          <Slug slug={`${handle}'s`} prefix="@" />
          <span className="text-pink-500"> super followers</span>
          <span> can collect</span>
        </>
      ) : (
        <>
          <UsersIcon className="text-brand h-4 w-4" />
          <span>Only </span>
          <Slug slug={`${handle}'s`} prefix="@" />
          <span> followers can collect</span>
        </>
      )}
    </Card>
  );
};

export default CollectWarning;
