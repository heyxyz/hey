import type { FC } from 'react';

import { HandRaisedIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import Link from 'next/link';

interface SupportProps {
  className?: string;
}

const Support: FC<SupportProps> = ({ className = '' }) => {
  return (
    <Link
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      href="/support"
      target="_blank"
    >
      <HandRaisedIcon className="size-4" />
      <div>Support</div>
    </Link>
  );
};

export default Support;
