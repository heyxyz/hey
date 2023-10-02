import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

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
      <div>
        <Cog6ToothIcon className="h-4 w-4" />
      </div>
      <div>
        <Trans>Settings</Trans>
      </div>
    </div>
  );
};

export default Settings;
