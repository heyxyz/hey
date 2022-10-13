import { useQuery } from '@apollo/client';
import { CustomFiltersTypes, NotificationCountDocument } from '@generated/types';
import { LightningBoltIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { NOTIFICATION } from 'src/tracking';

const NotificationIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const notificationCount = useAppPersistStore((state) => state.notificationCount);
  const setNotificationCount = useAppPersistStore((state) => state.setNotificationCount);
  const [showBadge, setShowBadge] = useState(false);
  const { data } = useQuery(NotificationCountDocument, {
    variables: { request: { profileId: currentProfile?.id, customFilters: [CustomFiltersTypes.Gardeners] } },
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
    <Link
      href="/notifications"
      className="flex items-start"
      onClick={() => {
        setNotificationCount(data?.notifications?.pageInfo?.totalCount || 0);
        setShowBadge(false);
        Leafwatch.track(NOTIFICATION.OPEN);
      }}
    >
      <LightningBoltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      {showBadge && <span className="w-2 h-2 bg-red-500 rounded-full" />}
    </Link>
  );
};

export default NotificationIcon;
