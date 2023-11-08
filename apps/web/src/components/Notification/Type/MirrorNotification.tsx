import Markup from '@components/Shared/Markup';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { MirrorNotification } from '@hey/lens';
import getPublicationData from '@hey/lib/getPublicationData';
import Link from 'next/link';
import plur from 'plur';
import type { FC } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';

interface MirrorNotificationProps {
  notification: MirrorNotification;
}

const MirrorNotification: FC<MirrorNotificationProps> = ({ notification }) => {
  const metadata = notification?.publication.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const mirrors = notification?.mirrors;
  const firstProfile = mirrors?.[0]?.profile;
  const length = mirrors.length - 1;
  const moreThanOneProfile = length > 1;

  const text = moreThanOneProfile
    ? `and ${length} ${plur('other', length)} mirrored your`
    : 'mirrored your';
  const type = notification?.publication.__typename;

  useEffectOnce(() => {
    if (notification?.publication.id && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PUBLICATION_VISIBLE',
        id: notification.publication.id
      });
    }
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ArrowsRightLeftIcon className="text-brand-500/70 h-6 w-6" />
        <div className="flex items-center space-x-1">
          {mirrors.slice(0, 10).map((mirror) => (
            <div key={mirror.mirrorId}>
              <NotificationProfileAvatar profile={mirror.profile} />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          text={text}
          type={type}
          linkToType={`/posts/${notification?.publication?.id}`}
        />
        <Link
          href={`/posts/${notification?.publication?.id}`}
          className="ld-text-gray-500 linkify mt-2 line-clamp-2"
        >
          <Markup mentions={notification.publication.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default MirrorNotification;
