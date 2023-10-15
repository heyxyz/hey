import Markup from '@components/Shared/Markup';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { MirrorNotification } from '@hey/lens';
import getPublicationData from '@lib/getPublicationData';
import Link from 'next/link';
import plur from 'plur';
import type { FC } from 'react';
import { memo } from 'react';

import {
  AggregatedNotificationTitle,
  NotificationProfileAvatar
} from '../Profile';

interface MirrorNotificationProps {
  notification: MirrorNotification;
}

const MirrorNotification: FC<MirrorNotificationProps> = ({ notification }) => {
  const metadata = notification?.publication.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const mirrors = notification?.mirrors;
  const firstProfile = mirrors?.[0]?.profile;

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ArrowsRightLeftIcon className="text-brand-500/70 h-6 w-6" />
            <div className="flex items-center space-x-1">
              {mirrors.map((mirror) => (
                <div key={mirror.mirrorId}>
                  <NotificationProfileAvatar profile={mirror.profile} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ml-9">
          <AggregatedNotificationTitle
            firstProfile={firstProfile}
            text={`and ${mirrors.length} ${plur(
              'other',
              mirrors.length
            )} mirrored your`}
            type={notification?.publication.__typename}
          />
          <Link
            href={`/posts/${notification?.publication?.id}`}
            className="lt-text-gray-500 linkify mt-2 line-clamp-2"
          >
            <Markup>{filteredContent}</Markup>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(MirrorNotification);
