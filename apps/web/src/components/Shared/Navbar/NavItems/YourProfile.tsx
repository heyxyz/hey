import type { FC } from 'react';

import { UserIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';

interface YourProfileProps {
  className?: string;
}

const YourProfile: FC<YourProfileProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <UserIcon className="size-4" />
      <div>Your profile</div>
    </div>
  );
};

export default YourProfile;
