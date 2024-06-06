import type { FC } from 'react';

import cn from '@good/ui/cn';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

interface SettingsProps {
  className?: string;
}

const Settings: FC<SettingsProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <Cog6ToothIcon className="size-4" />
      <div>Settings</div>
    </div>
  );
};

export default Settings;
