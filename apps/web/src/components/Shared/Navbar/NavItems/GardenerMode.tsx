import { BoltIcon as BoltIconOutline } from '@heroicons/react/24/outline';
import { BoltIcon as BoltIconSolid } from '@heroicons/react/24/solid';
import { FLIPPER_WORKER_URL } from '@hey/data/constants';
import { GARDENER } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { type FC } from 'react';
import { toast } from 'react-hot-toast';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';

interface ModModeProps {
  className?: string;
}

const GardenerMode: FC<ModModeProps> = ({ className = '' }) => {
  const gardenerMode = useFeatureFlagsStore((state) => state.gardenerMode);
  const setGardenerMode = useFeatureFlagsStore(
    (state) => state.setGardenerMode
  );

  const toggleModMode = () => {
    toast.promise(
      axios.post(
        `${FLIPPER_WORKER_URL}/updateGardenerMode`,
        { enabled: !gardenerMode },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Toggling gardener mode...',
        success: () => {
          setGardenerMode(!gardenerMode);
          Leafwatch.track(GARDENER.TOGGLE_MODE);

          return 'Gardener mode toggled!';
        },
        error: 'Failed to toggle gardener mode!'
      }
    );
  };

  return (
    <button
      onClick={toggleModMode}
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {gardenerMode ? (
        <BoltIconSolid className="h-4 w-4 text-green-600" />
      ) : (
        <BoltIconOutline className="h-4 w-4 text-red-500" />
      )}
      <div>Gardener mode</div>
    </button>
  );
};

export default GardenerMode;
