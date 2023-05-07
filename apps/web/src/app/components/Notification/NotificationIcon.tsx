'use client';
import { BellIcon } from '@heroicons/react/outline';
import { CustomFiltersTypes, useNotificationCountQuery } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
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
  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState<number>(0);

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
      setUnreadNotificationCount(currentTotalCount - readNotificationCount);
    } else {
      setNotificationCount(currentProfile?.id, currentTotalCount);
      setUnreadNotificationCount(0);
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
        setUnreadNotificationCount(0);
      }}
    >
      <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      {unreadNotificationCount > 0 && (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      )}
    </Link>
  );
};

export default NotificationIcon;
