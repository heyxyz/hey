import type { FC } from 'react';

import {
  ArrowTopRightOnSquareIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';

interface SupportProps {
  className?: string;
}

const Support: FC<SupportProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <div className="flex items-center space-x-1.5">
        <HandRaisedIcon className="size-4" />
        <div>Support</div>
      </div>
      <ArrowTopRightOnSquareIcon className="size-4 md:hidden" />
    </div>
  );
};

export default Support;
