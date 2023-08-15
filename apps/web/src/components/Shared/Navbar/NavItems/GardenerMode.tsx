import { LightningBoltIcon as LightningBoltIconOutline } from '@heroicons/react/outline';
import { LightningBoltIcon as LightningBoltIconSolid } from '@heroicons/react/solid';
import { ACCESS_WORKER_URL } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import { MOD } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import clsx from 'clsx';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useAccessStore } from 'src/store/access';
import { useAppStore } from 'src/store/app';

interface ModModeProps {
  className?: string;
}

const GardenerMode: FC<ModModeProps> = ({ className = '' }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const gardenerMode = useAccessStore((state) => state.gardenerMode);
  const setGardenerMode = useAccessStore((state) => state.setGardenerMode);

  const toggleModMode = () => {
    toast.promise(
      axios.post(`${ACCESS_WORKER_URL}/gardenerMode`, {
        id: currentProfile?.id,
        enabled: !gardenerMode,
        accessToken: localStorage.getItem(Localstorage.AccessToken)
      }),
      {
        loading: t`Toggling gardener mode...`,
        success: () => {
          setGardenerMode(!gardenerMode);
          Leafwatch.track(MOD.TOGGLE_MODE);

          return t`Gardener mode toggled!`;
        },
        error: t`Failed to toggle gardener mode!`
      }
    );
  };

  return (
    <button
      onClick={toggleModMode}
      className={clsx(
        'flex w-full items-center space-x-1.5 px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {gardenerMode ? (
        <LightningBoltIconSolid className="h-4 w-4 text-green-600" />
      ) : (
        <LightningBoltIconOutline className="h-4 w-4 text-red-500" />
      )}
      <div>
        <Trans>Gardener mode</Trans>
      </div>
    </button>
  );
};

export default GardenerMode;
