import useStaffMode from '@components/utils/hooks/useStaffMode';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import React from 'react';
import { useAppPersistStore } from 'src/store/app';
import { STAFFTOOLS } from 'src/tracking';

const StaffMode = () => {
  const { allowed: staffMode } = useStaffMode();
  const setStaffMode = useAppPersistStore((state) => state.setStaffMode);

  const toggleStaffMode = () => {
    setStaffMode(!staffMode);
    Analytics.track(STAFFTOOLS.TOGGLE_MODE);
  };

  return (
    <button onClick={toggleStaffMode}>
      {staffMode ? (
        <div className="flex items-center space-x-1.5">
          <div>
            <Trans>Disable staff mode</Trans>
          </div>
          <ShieldExclamationIcon className="w-4 h-4 text-green-600" />
        </div>
      ) : (
        <div className="flex items-center space-x-1.5">
          <div>
            <Trans>Enable staff mode</Trans>
          </div>
          <ShieldCheckIcon className="w-4 h-4 text-red-500" />
        </div>
      )}
    </button>
  );
};

export default StaffMode;
