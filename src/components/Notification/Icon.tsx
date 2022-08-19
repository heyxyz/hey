import { gql, useQuery } from '@apollo/client';
import { LightningBoltIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { NOTIFICATION } from 'src/tracking';

const NOTIFICATION_COUNT_QUERY = gql`
  query NotificationCount($request: NotificationRequest!) {
    notifications(request: $request) {
      pageInfo {
        totalCount
      }
    }
  }
`;

const NotificationIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const notificationCount = useAppPersistStore((state) => state.notificationCount);
  const setNotificationCount = useAppPersistStore((state) => state.setNotificationCount);
  const [showBadge, setShowBadge] = useState(false);
  const { data } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id
  });

  useEffect(() => {
    if (currentProfile && data) {
      const currentCount = data?.notifications?.pageInfo?.totalCount;
      setShowBadge(notificationCount !== currentCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Link href="/notifications">
      <a
        className="flex items-start"
        href="/notifications"
        onClick={() => {
          setNotificationCount(data?.notifications?.pageInfo?.totalCount);
          setShowBadge(false);
          Mixpanel.track(NOTIFICATION.OPEN);
        }}
      >
        <LightningBoltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        {showBadge && <div className="w-2 h-2 bg-red-500 rounded-full" />}
      </a>
    </Link>
  );
};

export default NotificationIcon;
