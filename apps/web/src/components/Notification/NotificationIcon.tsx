import { BellIcon } from '@heroicons/react/outline';
import { CustomFiltersTypes, useNotificationCountQuery } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useNotificationPersistStore } from 'src/store/notification';

const NotificationIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const getNotificationCount = useNotificationPersistStore(
    (state) => state.getNotificationCount
  );
  const setNotificationCount = useNotificationPersistStore(
    (state) => state.setNotificationCount
  );
  const hasUnreadNotifications = useNotificationPersistStore(
    (state) => state.hasUnreadNotifications
  );
  const setHasUnreadNotifications = useNotificationPersistStore(
    (state) => state.setHasUnreadNotifications
  );

  const { data, loading } = useNotificationCountQuery({
    variables: {
      request: {
        profileId: currentProfile?.id,
        customFilters: [CustomFiltersTypes.Gardeners]
      }
    },
    skip: !currentProfile?.id,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (!currentProfile || loading) {
      return;
    }

    const currentTotalCount = data?.notifications?.pageInfo?.totalCount || 0;
    const readNotificationCount = getNotificationCount(currentProfile?.id);

    if (readNotificationCount) {
      setHasUnreadNotifications(currentTotalCount - readNotificationCount > 0);
    } else {
      setNotificationCount(currentProfile?.id, currentTotalCount);
      setHasUnreadNotifications(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  return (
    <Link
      href="/notifications"
      className="hidden min-w-[40px] items-start justify-center rounded-md p-1 hover:bg-gray-300/20 md:flex"
      onClick={() => {
        setNotificationCount(
          currentProfile?.id,
          data?.notifications?.pageInfo?.totalCount || 0
        );
        setHasUnreadNotifications(false);
      }}
    >
      <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      {hasUnreadNotifications && (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      )}
    </Link>
  );
};

export default NotificationIcon;
