import { CogIcon } from '@heroicons/react/outline';
import cn from '@lenster/ui/cn';
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
      <CogIcon className="h-4 w-4" />
      <div>
        <Trans>Settings</Trans>
      </div>
    </div>
  );
};

export default Settings;
