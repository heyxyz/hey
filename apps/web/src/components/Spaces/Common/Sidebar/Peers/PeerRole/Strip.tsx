import {
  MegaphoneIcon,
  PhoneXMarkIcon,
  UserIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';
import cn from '@lenster/ui/cn';
import type { FC } from 'react';
import React from 'react';

interface StripProps {
  type: 'personNormal' | 'speaker' | 'leave' | 'remove';
  title: string;
  className?: string;
  variant: 'normal' | 'danger';
  onClick?: () => void;
}

const PeerIcons = (type: 'personNormal' | 'speaker' | 'leave' | 'remove') => {
  switch (type) {
    case 'personNormal':
      return <UserIcon className="h-4 w-4" />;
    case 'remove' || 'close':
      return <XCircleIcon className="h-4 w-4" />;
    case 'speaker':
      return <MegaphoneIcon className="h-4 w-4" />;
    case 'leave':
      return <PhoneXMarkIcon className="h-4 w-4" />;
  }
};

const Strip: FC<StripProps> = ({ type, title, variant, onClick }) => {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-1 p-1 text-sm font-normal',
        variant === 'normal'
          ? 'text-gray-500 dark:text-gray-400'
          : 'text-red-400'
      )}
      onClick={onClick}
    >
      <div className="flex h-6 w-6 items-center justify-center">
        {PeerIcons(type)}
      </div>
      <div className="text-xs">{title}</div>
    </div>
  );
};
export default React.memo(Strip);
