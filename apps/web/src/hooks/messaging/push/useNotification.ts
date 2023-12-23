import { useCallback } from 'react';

const useNotification = () => {
  const isNotificationEnabled = useCallback(() => {
    return Notification.permission === 'granted';
  }, []);

  const askForPermission = useCallback(async () => {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isNotificationEnabled()) {
      console.error('Notifications are not enabled');
      return;
    }
    new Notification(title, options);
  };

  return { askForPermission, isNotificationEnabled, sendNotification };
};

export default useNotification;
