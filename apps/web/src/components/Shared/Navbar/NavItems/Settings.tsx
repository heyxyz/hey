import { CogIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';

interface SettingsProps {
  className?: string;
}

const Settings: FC<SettingsProps> = ({ className = '' }) => {
  return (
    <div className={clsx('flex w-full items-center space-x-1.5', className)}>
      <CogIcon className="h-4 w-4" />
      <div>
        <Trans>Settings</Trans>
      </div>
    </div>
  );
};

export default Settings;
