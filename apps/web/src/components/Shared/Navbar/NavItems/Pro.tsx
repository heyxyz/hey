import { BriefcaseIcon } from '@heroicons/react/24/solid';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { type FC } from 'react';

interface ProProps {
  onClick?: () => void;
  className?: string;
}

const Pro: FC<ProProps> = ({ onClick, className = '' }) => {
  return (
    <Link
      href="/pro"
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={onClick}
    >
      <BriefcaseIcon className="h-4 w-4 text-green-600" />
      <div>Pro</div>
    </Link>
  );
};

export default Pro;
