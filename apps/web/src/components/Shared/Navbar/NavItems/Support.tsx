import type { FC } from 'react';

import showCrisp from '@helpers/showCrisp';
import {
  ArrowTopRightOnSquareIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';

interface SupportProps {
  className?: string;
  onClick?: () => void;
}

const Support: FC<SupportProps> = ({ className = '', onClick }) => {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-between px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => {
        onClick?.();
        showCrisp();
      }}
    >
      <div className="flex items-center space-x-1.5">
        <HandRaisedIcon className="size-4" />
        <div>Support</div>
      </div>
      <ArrowTopRightOnSquareIcon className="size-4 md:hidden" />
    </button>
  );
};

export default Support;
