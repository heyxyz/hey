import {
  GlobeAltIcon,
  HashtagIcon,
  TemplateIcon
} from '@heroicons/react/outline';
import {
  GIT_COMMIT_SHA,
  IS_MAINNET,
  IS_PRODUCTION
} from '@lenster/data/constants';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

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
    <div className="flex justify-between bg-gray-200 px-3 py-1 text-sm dark:bg-gray-800">
      <div className="mr-5 flex flex-wrap items-center gap-2">
        <Performance />
        <div className="flex items-center space-x-1">
          <GlobeAltIcon
            className={clsx(
              IS_PRODUCTION ? 'text-green-500' : 'text-yellow-500',
              'h-4 w-4'
            )}
          />
          {IS_PRODUCTION.toString()}
          <Badge>
            {IS_PRODUCTION ? 'prod' : 'dev'}{' '}
            <span className="text-[10px]">
              ({IS_MAINNET ? 'mainnet' : 'testnet'})
            </span>
          </Badge>
        </div>
        {GIT_COMMIT_SHA && (
          <Link
            href={`https://github.com/lensterxyz/lenster/commit/${GIT_COMMIT_SHA}`}
            className="flex items-center space-x-1"
            title="Git commit SHA"
            target="_blank"
            rel="noreferrer noopener"
          >
            <HashtagIcon className="h-4 w-4" />
            <Badge>{GIT_COMMIT_SHA}</Badge>
          </Link>
        )}
      </div>
      <div className="flex items-center">
        <Link href="/stafftools">
          <TemplateIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default StaffBar;
