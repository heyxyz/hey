import { UserGroupIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

interface CommunitiesProps {
  onClick?: () => void;
  className?: string;
}

const Communities: FC<CommunitiesProps> = ({ onClick, className = '' }) => {
  return (
    <Link
      href="/communities"
      className={clsx(
        'flex w-full items-center space-x-1.5 px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={onClick}
    >
      <UserGroupIcon className="h-4 w-4" />
      <div>
        <Trans>Communities</Trans>
      </div>
    </Link>
  );
};

export default Communities;
