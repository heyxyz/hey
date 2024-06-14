import type { FC } from 'react';

import cn from '@good/ui/cn';
import { HandRaisedIcon } from '@heroicons/react/24/outline';

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
      <HandRaisedIcon className="size-4" />
      <div>Support</div>
    </div>
  );
};

export default Support;
