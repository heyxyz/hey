'use client';
import MetaTags from '@components/Common/MetaTags';
import Custom404 from '@components/Custom404';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import { useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import FeedType from './FeedType';
import List from './List';
import Settings from './Settings';

const Notification: FC = () => {
  const searchParams = useSearchParams();
  const { type } = Object.fromEntries(searchParams.entries());

  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type &&
      ['all', 'mentions', 'comments', 'likes', 'collects'].includes(
        type as string
      )
      ? type.toString().toUpperCase()
      : 'ALL'
  );

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'notifications' });
  }, []);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <div className="flex grow justify-center px-0 py-8 sm:px-6 lg:px-8">
      <MetaTags title={t`Notifications • ${APP_NAME}`} />
      <div className="w-full max-w-4xl space-y-3">
        <div className="flex flex-wrap justify-between gap-3 pb-2">
          <FeedType setFeedType={setFeedType} feedType={feedType} />
          <Settings />
        </div>
        <List feedType={feedType} />
      </div>
    </div>
  );
};

export default Notification;
