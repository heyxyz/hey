import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from 'data/constants';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import FeedType from './FeedType';
import List from './List';

const Notification: FC = () => {
  const {
    query: { type }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type && ['all', 'mentions', 'comments', 'likes', 'collects'].includes(type as string)
      ? type.toString().toUpperCase()
      : 'ALL'
  );

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <div className="flex flex-grow justify-center px-0 sm:px-6 lg:px-8 py-8">
      <MetaTags title={`Notifications • ${APP_NAME}`} />
      <div className="max-w-4xl w-full space-y-3">
        <div className="flex gap-3 pb-2">
          <FeedType setFeedType={setFeedType} feedType={feedType} />
        </div>
        <List feedType={feedType} />
      </div>
    </div>
  );
};

export default Notification;
