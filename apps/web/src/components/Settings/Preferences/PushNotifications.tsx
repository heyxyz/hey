import { BellIcon } from '@heroicons/react/24/outline';
import { SETTINGS } from '@hey/data/tracking';
import { type FC, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import ToggleWithHelper from '@/components/Shared/ToggleWithHelper';
import { Leafwatch } from '@/lib/leafwatch';

const PushNotifications: FC = () => {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(false);

  useEffectOnce(() => {
    if (Notification.permission === 'granted') {
      setPushNotificationsEnabled(true);
    }
  });

  const togglePushNotifications = async () => {
    if (Notification.permission !== 'granted') {
      const status = await Notification.requestPermission();
      if (status === 'granted') {
        setPushNotificationsEnabled(true);
      }

      Leafwatch.track(SETTINGS.PREFERENCES.TOGGLE_PUSH_NOTIFICATIONS, {
        enabled: status === 'granted'
      });
    }
  };

  return (
    <ToggleWithHelper
      on={pushNotificationsEnabled}
      setOn={togglePushNotifications}
      heading="Push Notifications"
      description="Turn on push notifications to receive notifications."
      icon={<BellIcon className="h-4 w-4" />}
    />
  );
};

export default PushNotifications;
