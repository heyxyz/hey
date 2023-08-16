import { ShieldCheckIcon as ShieldCheckIconOutline } from '@heroicons/react/outline';
import { ShieldCheckIcon as ShieldCheckIconSolid } from '@heroicons/react/solid';
import { ACCESS_WORKER_URL } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import { STAFFTOOLS } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import clsx from 'clsx';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useAccessStore } from 'src/store/access';
import { useAppStore } from 'src/store/app';

interface StaffModeProps {
  className?: string;
}

const StaffMode: FC<StaffModeProps> = ({ className = '' }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = useAccessStore((state) => state.staffMode);
  const setStaffMode = useAccessStore((state) => state.setStaffMode);

  const toggleStaffMode = async () => {
    toast.promise(
      axios.post(`${ACCESS_WORKER_URL}/staffMode`, {
        id: currentProfile?.id,
        enabled: !staffMode,
        accessToken: localStorage.getItem(Localstorage.AccessToken)
      }),
      {
        loading: t`Toggling staff mode...`,
        success: () => {
          setStaffMode(!staffMode);
          Leafwatch.track(STAFFTOOLS.TOGGLE_MODE);

          return t`Staff mode toggled!`;
        },
        error: t`Failed to toggle staff mode!`
      }
    );
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
        <ShieldCheckIconSolid className="h-4 w-4 text-green-600" />
      ) : (
        <ShieldCheckIconOutline className="h-4 w-4 text-red-500" />
      )}
      <div>
        <Trans>Staff mode</Trans>
      </div>
    </button>
  );
};

export default StaffMode;
