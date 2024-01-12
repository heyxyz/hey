import type { ActedNotification as TActedNotification } from '@hey/lens';
import type { FC } from 'react';

import Markup from '@components/Shared/Markup';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import pushToImpressions from '@lib/pushToImpressions';
import Link from 'next/link';
import plur from 'plur';
import { useEffectOnce } from 'usehooks-ts';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';

interface ActedNotificationProps {
  notification: TActedNotification;
}

const ActedNotification: FC<ActedNotificationProps> = ({ notification }) => {
  const publication = notification?.publication;
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { metadata } = targetPublication;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const actions = notification?.actions;
  const firstProfile = actions?.[0]?.by;
  const length = actions.length - 1;
  const moreThanOneProfile = length > 1;

  const text = moreThanOneProfile
    ? `and ${length} ${plur('other', length)} acted on your`
    : 'acted on your';
  const type = notification?.publication.__typename;

  useEffectOnce(() => {
    pushToImpressions(notification.publication.id);
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <RectangleStackIcon className="text-brand-500/70 size-6" />
        <div className="flex items-center space-x-1">
          {actions.slice(0, 10).map((action) => (
            <div key={action.by.id}>
              <NotificationProfileAvatar profile={action.by} />
            </div>
          ))}
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
          <Markup mentions={targetPublication.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default ActedNotification;
