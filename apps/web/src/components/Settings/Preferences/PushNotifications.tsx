import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { BellIcon } from '@heroicons/react/24/outline';
import { type FC, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

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
