import { UserIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';

interface YourProfileProps {
  className?: string;
}

const YourProfile: FC<YourProfileProps> = ({ className = '' }) => {
  return (
    <div className={clsx('flex w-full space-x-1.5', className)}>
      <UserIcon className="h-4 w-4" />
      <div>
        <Trans>Your Profile</Trans>
      </div>
    </div>
  );
};

export default YourProfile;
