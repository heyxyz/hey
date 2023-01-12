import useStaffMode from '@components/utils/hooks/useStaffMode';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { useAppPersistStore } from 'src/store/app';
import { STAFFTOOLS } from 'src/tracking';

type Props = {
  className?: string;
};

const StaffMode: FC<Props> = ({ className = '' }) => {
  const { allowed: staffMode } = useStaffMode();
  const setStaffMode = useAppPersistStore((state) => state.setStaffMode);

  const toggleStaffMode = () => {
    setStaffMode(!staffMode);
    Analytics.track(STAFFTOOLS.TOGGLE_MODE);
  };

  return (
    <button
      onClick={toggleStaffMode}
      className={clsx(
        'flex items-center space-x-1.5 px-4 py-1.5 text-sm w-full text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {staffMode ? (
        <>
          <ShieldExclamationIcon className="w-4 h-4 text-green-600" />
          <div>
            <Trans>Disable staff mode</Trans>
          </div>
        </>
      ) : (
        <>
          <ShieldCheckIcon className="w-4 h-4 text-red-500" />
          <div>
            <Trans>Enable staff mode</Trans>
          </div>
        </>
      )}
    </button>
  );
};

export default StaffMode;
