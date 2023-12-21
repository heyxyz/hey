import type { FC } from 'react';

import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';

interface ModProps {
  className?: string;
}

const Mod: FC<ModProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <ShieldCheckIcon className="size-4" />
      <div>Moderation</div>
    </div>
  );
};

export default Mod;
