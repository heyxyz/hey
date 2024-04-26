import type { FC } from 'react';

import { Errors } from '@hey/data';
import { SETTINGS } from '@hey/data/tracking';
import downloadJson from '@hey/helpers/downloadJson';
import { useNotificationsLazyQuery } from '@hey/lens';
import { Button, Card, CardHeader } from '@hey/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';

const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const { isSuspended } = useProfileRestriction();

  const [exportNotificiations] = useNotificationsLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

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
    <Card>
      <CardHeader
        body="Export all your notifications to a JSON file."
        title="Export notifications"
      />
      <div className="m-5">
        {notifications.length > 0 ? (
          <div className="pb-2">
            Exported <b>{notifications.length}</b> notifications
          </div>
        ) : null}
        {fetchCompleted ? (
          <Button onClick={download} outline>
            Download notifications
          </Button>
        ) : (
          <Button disabled={exporting} onClick={handleExportClick} outline>
            {exporting ? 'Exporting...' : 'Export now'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Notifications;
