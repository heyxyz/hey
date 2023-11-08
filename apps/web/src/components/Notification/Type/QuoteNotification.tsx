import Markup from '@components/Shared/Markup';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { QuoteNotification } from '@hey/lens';
import getPublicationData from '@hey/lib/getPublicationData';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';

interface QuoteNotificationProps {
  notification: QuoteNotification;
}

const QuoteNotification: FC<QuoteNotificationProps> = ({ notification }) => {
  const metadata = notification?.quote.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const firstProfile = notification.quote.by;

  const text = 'quoted your';
  const type = notification.quote.quoteOn.__typename;

  useEffectOnce(() => {
    if (notification?.quote.id && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PUBLICATION_VISIBLE',
        id: notification.quote.id
      });
    }
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ChatBubbleBottomCenterTextIcon className="text-brand-500/70 h-6 w-6" />
        <div className="flex items-center space-x-1">
          <NotificationProfileAvatar profile={firstProfile} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          text={text}
          type={type}
          linkToType={`/posts/${notification?.quote?.id}`}
        />
        <Link
          href={`/posts/${notification?.quote?.id}`}
          className="ld-text-gray-500 linkify mt-2 line-clamp-2"
        >
          <Markup mentions={notification.quote.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default QuoteNotification;
