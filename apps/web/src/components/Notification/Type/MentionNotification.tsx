import type { MentionNotification as TMirrorNotification } from '@hey/lens';
import type { FC } from 'react';

import Markup from '@components/Shared/Markup';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import getPublicationData from '@hey/lib/getPublicationData';
import Link from 'next/link';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';

interface MentionNotificationProps {
  notification: TMirrorNotification;
}

const MentionNotification: FC<MentionNotificationProps> = ({
  notification
}) => {
  const metadata = notification?.publication.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const firstProfile = notification.publication.by;

  const text = 'mentioned you in a';
  const type = notification.publication.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <AtSymbolIcon className="text-brand-500/70 size-6" />
        <div className="flex items-center space-x-1">
          <NotificationProfileAvatar profile={firstProfile} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          linkToType={`/posts/${notification?.publication?.id}`}
          text={text}
          type={type}
        />
        <Link
          className="ld-text-gray-500 linkify mt-2 line-clamp-2"
          href={`/posts/${notification?.publication?.id}`}
        >
          <Markup mentions={notification?.publication.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default MentionNotification;
