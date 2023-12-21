import type { CommentNotification as TCommentNotification } from '@hey/lens';
import type { FC } from 'react';

import Markup from '@components/Shared/Markup';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import getPublicationData from '@hey/lib/getPublicationData';
import Link from 'next/link';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';

interface CommentNotificationProps {
  notification: TCommentNotification;
}

const CommentNotification: FC<CommentNotificationProps> = ({
  notification
}) => {
  const metadata = notification?.comment.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const firstProfile = notification.comment.by;

  const text = 'commented on your';
  // TODO: remove ? when we have commentOn field in the comment
  const type = notification.comment.commentOn?.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ChatBubbleLeftRightIcon className="text-brand-500/70 size-6" />
        <div className="flex items-center space-x-1">
          <NotificationProfileAvatar profile={firstProfile} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          linkToType={`/posts/${notification?.comment?.id}`}
          text={text}
          type={type}
        />
        <Link
          className="ld-text-gray-500 linkify mt-2 line-clamp-2"
          href={`/posts/${notification?.comment?.id}`}
        >
          <Markup mentions={notification.comment.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default CommentNotification;
