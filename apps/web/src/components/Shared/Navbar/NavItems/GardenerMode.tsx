import type { FC } from 'react';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { BoltIcon as BoltIconOutline } from '@heroicons/react/24/outline';
import { BoltIcon as BoltIconSolid } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { GARDENER } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

interface ModModeProps {
  className?: string;
}

const GardenerMode: FC<ModModeProps> = ({ className = '' }) => {
  const { gardenerMode, setGardenerMode } = useFeatureFlagsStore();

  const toggleModMode = () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/gardenerMode`,
        { enabled: !gardenerMode },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Failed to toggle gardener mode!',
        loading: 'Toggling gardener mode...',
        success: () => {
          setGardenerMode(!gardenerMode);
          Leafwatch.track(GARDENER.TOGGLE_MODE, {
            enabled: !gardenerMode
          });

          return 'Gardener mode toggled!';
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
      onClick={toggleModMode}
      type="button"
    >
      {gardenerMode ? (
        <BoltIconSolid className="size-4 text-green-600" />
      ) : (
        <BoltIconOutline className="size-4 text-red-500" />
      )}
      <div>Gardener mode</div>
    </button>
  );
};

export default GardenerMode;
