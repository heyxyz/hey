import type { FC } from 'react';

import {
  ArrowTopRightOnSquareIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import Link from 'next/link';

interface SupportProps {
  className?: string;
  onClick?: () => void;
}

const Support: FC<SupportProps> = ({ className = '', onClick }) => {
  return (
    <Link
      className={cn(
        'flex w-full items-center justify-between px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      href="/support"
      onClick={onClick}
    >
      <div className="flex items-center space-x-1.5">
        <HandRaisedIcon className="size-4" />
        <div>Support</div>
      </div>
      <ArrowTopRightOnSquareIcon className="size-4 md:hidden" />
    </Link>
  );
};

export default Support;
