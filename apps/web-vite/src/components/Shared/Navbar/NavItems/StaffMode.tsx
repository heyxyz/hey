import { ShieldCheckIcon as ShieldCheckIconOutline } from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldCheckIconSolid } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { type FC } from 'react';
import { toast } from 'react-hot-toast';
import { useFeatureFlagsStore } from '@persisted/useFeatureFlagsStore';
import useProfileStore from '@persisted/useProfileStore';

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
        loading: 'Toggling staff mode...',
        success: () => {
          axios.get(`${HEY_API_URL}/preference/getPreferences`, {
            params: { id: currentProfile?.id }
          });
          setStaffMode(!staffMode);
          Leafwatch.track(STAFFTOOLS.TOGGLE_MODE);

          return 'Staff mode toggled!';
        },
        error: 'Failed to toggle staff mode!'
      }
    );
  };

  return (
    <button
      onClick={toggleStaffMode}
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {staffMode ? (
        <ShieldCheckIconSolid className="h-4 w-4 text-green-600" />
      ) : (
        <ShieldCheckIconOutline className="h-4 w-4 text-red-500" />
      )}
      <div>Staff mode</div>
    </button>
  );
};

export default StaffMode;
