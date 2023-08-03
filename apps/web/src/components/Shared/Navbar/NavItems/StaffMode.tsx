import {
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/outline';
import { STAFFTOOLS } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import useStaffMode from 'src/hooks/useStaffMode';
import { useModePersistStore } from 'src/store/mode';

interface StaffModeProps {
  className?: string;
}

const StaffMode: FC<StaffModeProps> = ({ className = '' }) => {
  const { allowed: staffMode } = useStaffMode();
  const setStaffMode = useModePersistStore((state) => state.setStaffMode);

  const toggleStaffMode = () => {
    setStaffMode(!staffMode);
    Leafwatch.track(STAFFTOOLS.TOGGLE_MODE);
  };

  return (
    <button
      onClick={toggleStaffMode}
      className={clsx(
        'flex w-full items-center space-x-1.5 px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {staffMode ? (
        <>
          <ShieldExclamationIcon className="h-4 w-4 text-green-600" />
          <div>
            <Trans>Disable staff mode</Trans>
          </div>
        </>
      ) : (
        <>
          <ShieldCheckIcon className="h-4 w-4 text-red-500" />
          <div>
            <Trans>Enable staff mode</Trans>
          </div>
        </>
      )}
    </button>
  );
};

export default StaffMode;
