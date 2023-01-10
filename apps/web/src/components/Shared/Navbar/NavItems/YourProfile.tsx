import { UserIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { useAppStore } from 'src/store/app';

type Props = {
  onClick?: () => void;
  className?: string;
};

const YourProfile: FC<Props> = ({ onClick, className }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Link
      href={`/u/${formatHandle(currentProfile?.handle)}`}
      className={clsx('flex items-center space-x-1.5', className)}
      onClick={onClick}
    >
      <UserIcon className="w-4 h-4" />
      <div>
        <Trans>Your Profile</Trans>
      </div>
    </Link>
  );
};

export default YourProfile;
