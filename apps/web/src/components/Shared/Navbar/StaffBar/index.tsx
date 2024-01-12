import type { FC, ReactNode } from 'react';

import { GlobeAltIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { GIT_COMMIT_SHA, IS_MAINNET, IS_PRODUCTION } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import urlcat from 'urlcat';

import Performance from './Performance';

interface BadgeProps {
  children: ReactNode;
}

export const Badge: FC<BadgeProps> = ({ children }) => (
  <span className="rounded-md bg-gray-300 px-1.5 py-0.5 text-xs font-bold dark:bg-gray-600">
    {children}
  </span>
);

const StaffBar: FC = () => {
  return (
    <div className="flex items-center justify-between bg-gray-200 px-3 py-1 text-sm dark:bg-gray-800">
      <div className="mr-5 flex flex-wrap items-center gap-2">
        <Performance />
        <div className="flex items-center space-x-1">
          <GlobeAltIcon
            className={cn(
              IS_PRODUCTION ? 'text-green-500' : 'text-yellow-500',
              'size-4'
            )}
          />
          <Badge>
            {IS_PRODUCTION ? 'prod' : 'dev'}{' '}
            <span className="text-[10px]">
              ({IS_MAINNET ? 'mainnet' : 'testnet'})
            </span>
          </Badge>
        </div>
        {GIT_COMMIT_SHA ? (
          <Link
            className="flex items-center space-x-1"
            href={urlcat('https://github.com/heyxyz/hey/commit/:sha', {
              sha: GIT_COMMIT_SHA
            })}
            rel="noreferrer noopener"
            target="_blank"
            title="Git commit SHA"
          >
            <HashtagIcon className="size-4" />
            <Badge>{GIT_COMMIT_SHA}</Badge>
          </Link>
        ) : null}
      </div>
      <Link className="flex items-center space-x-2" href="/staff">
        <ShieldCheckIcon className="size-4 text-green-600" />
        <span className="hidden sm:block">Dashboard</span>
      </Link>
    </div>
  );
};

export default StaffBar;
