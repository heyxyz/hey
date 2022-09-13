import Markup from '@components/Shared/Markup';
import { NewReactionNotification } from '@generated/types';
import { HeartIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import React, { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';

dayjs.extend(relativeTime);

interface Props {
  notification: NewReactionNotification;
}

const LikeNotification: FC<Props> = ({ notification }) => {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-3">
          <HeartIcon className="h-6 w-6 text-pink-500/70" />
          <NotificationProfileAvatar profile={notification?.profile} />
        </div>
        <div className="ml-9">
          <NotificationProfileName profile={notification?.profile} />{' '}
          <span className="pl-0.5 text-gray-600 dark:text-gray-400">liked your </span>
          <Link href={`/posts/${notification?.publication?.id}`} className="font-bold">
            {notification?.publication?.__typename?.toLowerCase()}
          </Link>
          <Link
            href={`/posts/${notification?.publication?.id}`}
            className="text-gray-500 line-clamp-2 linkify mt-2"
          >
            <Markup>{notification?.publication?.metadata?.content}</Markup>
          </Link>
        </div>
      </div>
      <div className="text-gray-400 text-[12px]">{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
    </div>
  );
};

export default LikeNotification;
