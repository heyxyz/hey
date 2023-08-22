import { Trans } from '@lingui/macro';
import { clsx } from 'clsx';
import type { FC } from 'react';
import React from 'react';

import { PeerListIcons } from '../../../assets/Icons';

type StripProps = {
  type: string;
  title: string;
  className?: string;
  variant: 'normal' | 'danger';
  onClick?: () => void;
};

const Strip: FC<StripProps> = ({ type, title, variant, onClick }) => {
  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center gap-1 border-t border-neutral-300 p-1 text-sm font-normal dark:border-neutral-500',
        variant === 'normal'
          ? 'text-neutral-500 dark:text-neutral-400'
          : ' hover:bg-rgbColors-4 text-red-400'
      )}
      onClick={onClick}
    >
      <div className="flex h-6 w-6 items-center justify-center">
        {PeerListIcons[type]}
      </div>
      <div className="text-xs">
        <Trans>{title}</Trans>
      </div>
    </div>
  );
};
export default React.memo(Strip);
