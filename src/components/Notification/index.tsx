import TabButton from '@components/UI/TabButton';
import MetaTags from '@components/utils/MetaTags';
import { AtSymbolIcon, ChatAlt2Icon, LightningBoltIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { NOTIFICATION, PAGEVIEW } from 'src/tracking';

import List from './List';

const Notification: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<'ALL' | 'MENTIONS' | 'COMMENTS'>('ALL');

  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.NOTIFICATION });
  }, []);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <div className="flex flex-grow justify-center px-0 sm:px-6 lg:px-8 py-8">
      <MetaTags title={`Notifications • ${APP_NAME}`} />
      <div className="max-w-4xl w-full space-y-3">
        <div className="flex gap-3 pb-2">
          <TabButton
            name="All notifications"
            icon={<LightningBoltIcon className="w-4 h-4" />}
            active={feedType === 'ALL'}
            onClick={() => {
              setFeedType('ALL');
              Leafwatch.track(NOTIFICATION.SWITCH_ALL);
            }}
          />
          <TabButton
            name="Mentions"
            icon={<AtSymbolIcon className="w-4 h-4" />}
            active={feedType === 'MENTIONS'}
            onClick={() => {
              setFeedType('MENTIONS');
              Leafwatch.track(NOTIFICATION.SWITCH_MENTIONS);
            }}
          />
          <TabButton
            name="Comments"
            icon={<ChatAlt2Icon className="w-4 h-4" />}
            active={feedType === 'COMMENTS'}
            onClick={() => {
              setFeedType('COMMENTS');
              Leafwatch.track(NOTIFICATION.SWITCH_COMMENTS);
            }}
          />
        </div>
        <List feedType={feedType} />
      </div>
    </div>
  );
};

export default Notification;
