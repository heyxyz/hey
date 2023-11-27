import { BriefcaseIcon } from '@heroicons/react/24/solid';
import cn from '@hey/ui/cn';
import { type FC } from 'react';

interface ProProps {
  className?: string;
}

const Pro: FC<ProProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <BriefcaseIcon className="h-4 w-4 text-green-600" />
      <div>Pro</div>
    </div>
  );
};

export default Pro;
