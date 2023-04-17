import downloadJson from '@lib/downloadJson';
import { Trans } from '@lingui/macro';
import type { NotificationRequest } from 'lens';
import { useNotificationsLazyQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { Button, Card } from 'ui';

const Notifications: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: NotificationRequest = {
    profileId: currentProfile?.id,
    limit: 50
  };

  const [exportNotificiations] = useNotificationsLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    setExporting(true);
    const fetchNotifications = async (cursor?: string) => {
      const { data } = await exportNotificiations({
        variables: { request: { ...request, cursor } },
        onCompleted: (data) => {
          setNotifications((prev) => {
            const newNotifications = data.notifications.items.filter((newNotification) => {
              return !prev.some(
                (notification) => notification.notificationId === newNotification.notificationId
              );
            });

            return [...prev, ...newNotifications];
          });
        }
      });

      if (data?.notifications.items.length === 0 || !data?.notifications.pageInfo.next) {
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
      <div className="text-lg font-bold">
        <Trans>Export notifications</Trans>
      </div>
      <div className="pb-2">
        <Trans>Export all your notifications to a JSON file.</Trans>
      </div>
      {notifications.length > 0 ? (
        <div className="pb-2">
          Exported <b>{notifications.length}</b> notifications
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>
          <Trans>Download notifications</Trans>
        </Button>
      ) : (
        <Button onClick={handleExportClick} disabled={exporting}>
          {exporting ? <Trans>Exporting...</Trans> : <Trans>Export now</Trans>}
        </Button>
      )}
    </Card>
  );
};

export default Notifications;
