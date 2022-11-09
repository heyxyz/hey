import Markup from '@components/Shared/Markup';
import UserPreview from '@components/Shared/UserPreview';
import type { NewMentionNotification } from '@generated/types';
import { AtSymbolIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import type { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';

dayjs.extend(relativeTime);

interface Props {
  notification: NewMentionNotification;
}

const MentionNotification: FC<Props> = ({ notification }) => {
  const profile = notification?.mentionPublication?.profile;

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-3">
          <AtSymbolIcon className="h-6 w-6 text-orange-500/70" />
          <UserPreview profile={profile}>
            <NotificationProfileAvatar profile={profile} />
          </UserPreview>
        </div>
        <div className="ml-9">
          <NotificationProfileName profile={profile} />{' '}
          <span className="text-gray-600 dark:text-gray-400">mentioned you in a </span>
          <Link href={`/posts/${notification?.mentionPublication?.id}`} className="font-bold">
            {notification?.mentionPublication.__typename?.toLowerCase()}
          </Link>
          <Link
            href={`/posts/${notification?.mentionPublication.id}`}
            className="text-gray-500 line-clamp-2 linkify mt-2"
          >
            <Markup>{notification?.mentionPublication?.metadata?.content}</Markup>
          </Link>
        </div>
      </div>
      <div className="text-gray-400 text-[12px]">{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
    </div>
  );
};

export default MentionNotification;
