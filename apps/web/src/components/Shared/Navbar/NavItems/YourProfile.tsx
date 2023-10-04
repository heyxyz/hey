import { UserIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

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
      <div>
        <UserIcon className="h-4 w-4" />
      </div>
      <div>
        <Trans>Your profile</Trans>
      </div>
    </div>
  );
};

export default YourProfile;
