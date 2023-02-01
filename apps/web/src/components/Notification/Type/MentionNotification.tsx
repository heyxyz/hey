import Markup from '@components/Shared/Markup';
import UserPreview from '@components/Shared/UserPreview';
import type { MessageDescriptor } from '@generated/types';
import { AtSymbolIcon } from '@heroicons/react/solid';
import formatTime from '@lib/formatTime';
import { defineMessage } from '@lingui/macro';
import { Trans } from '@lingui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewMentionNotification } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';

dayjs.extend(relativeTime);

interface Props {
  notification: NewMentionNotification;
}

const messages: Record<string, MessageDescriptor> = {
  comment: defineMessage({
    id: '<0><1/> mentioned you in a <2>comment</2></0>'
  }),
  mirror: defineMessage({
    id: '<0><1/> mentioned you in a <2>mirror</2></0>'
  }),
  post: defineMessage({
    id: '<0><1/> mentioned you in a <2>post</2></0>'
  })
};

const defaultMessage = (typeName: string): string => {
  return '<0><1/> mentioned you in a <2>' + typeName + '</2></0>';
};

const MentionNotification: FC<Props> = ({ notification }) => {
  const profile = notification?.mentionPublication?.profile;
  const typeName = notification?.mentionPublication.__typename?.toLowerCase() || '';
  return (
    <div className="flex items-start justify-between">
      <div className="w-4/5 space-y-2">
        <div className="flex items-center space-x-3">
          <AtSymbolIcon className="h-6 w-6 text-orange-500/70" />
          <UserPreview profile={profile}>
            <NotificationProfileAvatar profile={profile} />
          </UserPreview>
        </div>
        <div className="ml-9">
          <Trans
            id={messages[typeName]?.id || defaultMessage(typeName)}
            components={[
              <span className="text-gray-600 dark:text-gray-400" key="" />,
              <NotificationProfileName profile={profile} key="" />,
              <Link href={`/posts/${notification?.mentionPublication?.id}`} className="font-bold" key="" />
            ]}
          />
          <Link
            href={`/posts/${notification?.mentionPublication.id}`}
            className="lt-text-gray-500 line-clamp-2 linkify mt-2"
          >
            <Markup>{notification?.mentionPublication?.metadata?.content}</Markup>
          </Link>
        </div>
      </div>
      <div className="text-[12px] text-gray-400" title={formatTime(notification?.createdAt)}>
        {dayjs(new Date(notification?.createdAt)).fromNow()}
      </div>
    </div>
  );
};

export default MentionNotification;
