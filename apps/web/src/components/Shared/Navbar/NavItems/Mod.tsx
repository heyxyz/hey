import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import cn from '@lenster/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

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
      <ShieldCheckIcon className="h-4 w-4" />
      <div>
        <Trans>Moderation</Trans>
      </div>
    </div>
  );
};

export default Mod;
