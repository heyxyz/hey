import type { FC } from 'react';

import { LifebuoyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import cn from '../cn';

interface ErrorMessageProps {
  className?: string;
  error?: Error;
  title?: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({
  className = '',
  error,
  title
}) => {
  if (!error) {
    return null;
  }

  return (
    <div
      className={cn(
        'space-y-1 rounded-xl border-2 border-red-500/50 bg-red-50 p-4 text-sm dark:bg-red-900/10',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {title ? (
          <h3 className="font-medium text-red-800 dark:text-red-200">
            {title}
          </h3>
        ) : null}
        <div className="flex items-center space-x-1 text-xs text-red-800">
          <LifebuoyIcon className="size-4" />
          <Link className="font-bold underline" href="/support">
            Contact Support
          </Link>
        </div>
      </div>
      <div className="break-words text-red-700 dark:text-red-200">
        {error?.message}
      </div>
    </div>
  );
};
