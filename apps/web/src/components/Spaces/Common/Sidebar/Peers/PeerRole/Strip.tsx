import { clsx } from 'clsx';
import React from 'react';

import { PeerListIcons } from '../../../assets/Icons';

type StripProps = {
  type: string;
  title: string;
  className?: string;
  variant: 'normal' | 'danger';
  onClick?: () => void;
};

const Strip: React.FC<StripProps> = ({ type, title, variant, onClick }) => {
  return (
    <div
      className={clsx(
        'mb-1 flex cursor-pointer items-center gap-3 rounded-md p-1 text-sm font-normal transition-all duration-300 ease-in-out last:mb-0',
        variant === 'normal'
          ? 'text-rgbColors-3'
          : ' hover:bg-rgbColors-4 text-red-400 '
      )}
      onClick={onClick}
    >
      <div className="flex h-6 w-6 items-center justify-center">
        {PeerListIcons[type]}
      </div>
      <div className="text-sm">{title}</div>
    </div>
  );
};
export default React.memo(Strip);
