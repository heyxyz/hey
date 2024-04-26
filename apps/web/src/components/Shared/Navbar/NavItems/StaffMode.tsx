import type { FC } from 'react';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { ShieldCheckIcon as ShieldCheckIconOutline } from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldCheckIconSolid } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

interface StaffModeProps {
  className?: string;
}

const StaffMode: FC<StaffModeProps> = ({ className = '' }) => {
  const { setStaffMode, staffMode } = useFeatureFlagsStore();

  const toggleStaffMode = () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/staffMode`,
        { enabled: !staffMode },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Failed to toggle staff mode!',
        loading: 'Toggling staff mode...',
        success: () => {
          setStaffMode(!staffMode);
          Leafwatch.track(STAFFTOOLS.TOGGLE_MODE, {
            enabled: !staffMode
          });

          return 'Staff mode toggled!';
        }
      }
    );
  };

  return (
    <button
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={toggleStaffMode}
      type="button"
    >
      {staffMode ? (
        <ShieldCheckIconSolid className="size-4 text-green-600" />
      ) : (
        <ShieldCheckIconOutline className="size-4 text-red-500" />
      )}
      <div>Staff mode</div>
    </button>
  );
};

export default StaffMode;
