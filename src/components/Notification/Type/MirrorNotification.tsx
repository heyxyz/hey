import Markup from '@components/Shared/Markup';
import { NewMirrorNotification } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import React, { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';

dayjs.extend(relativeTime);

interface Props {
  notification: NewMirrorNotification;
}

const MirrorNotification: FC<Props> = ({ notification }) => {
  const publicationType = notification?.publication?.metadata?.attributes[0]?.value;
  // @ts-ignore
  const pubId = notification?.publication?.pubId;

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-3">
          <SwitchHorizontalIcon className="h-6 w-6 text-brand-500/70" />
          <NotificationProfileAvatar profile={notification?.profile} />
        </div>
        <div className="ml-9">
          <NotificationProfileName profile={notification?.profile} />{' '}
          <span className="pl-0.5 text-gray-600 dark:text-gray-400">mirrored your </span>
          <Link href={`/posts/${pubId}`} className="font-bold">
            {notification?.publication?.__typename === 'Post'
              ? publicationType === 'crowdfund'
                ? 'crowdfund'
                : notification?.publication?.__typename?.toLowerCase()
              : notification?.publication?.__typename?.toLowerCase()}
          </Link>
          <Link href={`/posts/${pubId}`} className="text-gray-500 line-clamp-2 linkify mt-2">
            {publicationType === 'crowdfund' ? (
              notification?.publication?.metadata?.name
            ) : (
              <Markup>{notification?.publication?.metadata?.content}</Markup>
            )}
          </Link>
        </div>
      </div>
      <div className="text-gray-400 text-[12px]">{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
    </div>
  );
};

export default MirrorNotification;
