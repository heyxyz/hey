import type { FC } from 'react';

import { CheckCircleIcon as CheckCircleIconOutline } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { APP_NAME, HEY_API_URL, STATIC_IMAGES_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import { Card, CardHeader, Tooltip } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

const icons = [
  { id: 0, name: 'Default' },
  { id: 1, name: 'Pride' }
];

const AppIcon: FC = () => {
  const { appIcon, setAppIcon } = usePreferencesStore();
  const [updating, setUpdating] = useState(false);

  const updateAppIcon = (id: number) => {
    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preferences/update`,
        { appIcon: id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating app icon';
        },
        loading: 'Updating app icon...',
        success: () => {
          setUpdating(false);
          setAppIcon(id);
          Leafwatch.track(SETTINGS.PRO.APP_ICON, { appIcon: id });

          return 'App icon updated';
        }
      }
    );
  };

  return (
    <Card>
      <CardHeader
        body={`Choose a custom app icon for ${APP_NAME}, that will be used everywhere on the app.`}
        title="Choose App Icon"
      />
      <div className="m-5 flex flex-wrap items-center gap-x-8">
        {icons.map((icon) => (
          <Tooltip content={icon.name} key={icon.id} placement="top">
            <button
              className="flex flex-col items-center space-y-2"
              disabled={updating}
              onClick={() => updateAppIcon(icon.id)}
            >
              <img
                alt={icon.name}
                className="size-10"
                src={`${STATIC_IMAGES_URL}/app-icon/${icon.id}.png`}
              />
              {icon.id === appIcon ? (
                <CheckCircleIconSolid className="size-5 text-green-500" />
              ) : (
                <CheckCircleIconOutline className="ld-text-gray-500 size-5" />
              )}
            </button>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};

export default AppIcon;
