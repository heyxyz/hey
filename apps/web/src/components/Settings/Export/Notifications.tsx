import type { FC } from 'react';

import { SETTINGS } from '@hey/data/tracking';
import { useNotificationsLazyQuery } from '@hey/lens';
import downloadJson from '@hey/lib/downloadJson';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';

const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const [exportNotificiations] = useNotificationsLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Leafwatch.track(SETTINGS.EXPORT.NOTIFICATIONS);
    setExporting(true);
    const fetchNotifications = async (cursor?: string) => {
      const { data } = await exportNotificiations({
        onCompleted: (data) => {
          setNotifications((prev) => {
            const newNotifications = data.notifications.items.filter(
              (newNotification) => {
                return !prev.some(
                  (notification) => notification.id === newNotification.id
                );
              }
            );

            return [...prev, ...newNotifications];
          });
        },
        variables: { request: { cursor } }
      });

      if (
        data?.notifications.items.length === 0 ||
        !data?.notifications.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchNotifications(data?.notifications.pageInfo.next);
      }
    };

    await fetchNotifications();
  };

  const download = () => {
    downloadJson(notifications, 'notifications', () => {
      setNotifications([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Export notifications</div>
      <div className="pb-2">Export all your notifications to a JSON file.</div>
      {notifications.length > 0 ? (
        <div className="pb-2">
          Exported <b>{notifications.length}</b> notifications
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>Download notifications</Button>
      ) : (
        <Button disabled={exporting} onClick={handleExportClick}>
          {exporting ? 'Exporting...' : 'Export now'}
        </Button>
      )}
    </Card>
  );
};

export default Notifications;
