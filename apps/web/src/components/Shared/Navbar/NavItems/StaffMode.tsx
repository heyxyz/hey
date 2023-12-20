import type { FC } from 'react';

import { ShieldCheckIcon as ShieldCheckIconOutline } from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldCheckIconSolid } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import getPreferences from '@hey/lib/api/getPreferences';
import cn from '@hey/ui/cn';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface StaffModeProps {
  className?: string;
}

const StaffMode: FC<StaffModeProps> = ({ className = '' }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);
  const setStaffMode = useFeatureFlagsStore((state) => state.setStaffMode);

  const toggleStaffMode = async () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/feature/updateStaffMode`,
        { enabled: !staffMode },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: 'Failed to toggle staff mode!',
        loading: 'Toggling staff mode...',
        success: () => {
          getPreferences(currentProfile?.id, getAuthWorkerHeaders());
          setStaffMode(!staffMode);
          Leafwatch.track(STAFFTOOLS.TOGGLE_MODE);

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
