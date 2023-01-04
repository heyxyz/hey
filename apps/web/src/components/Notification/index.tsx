import MetaTags from '@components/Common/MetaTags';
import TabButton from '@components/UI/TabButton';
import { AtSymbolIcon, ChatAlt2Icon, CollectionIcon, LightningBoltIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { NOTIFICATION } from 'src/tracking';

import List from './List';

const Notification: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<'ALL' | 'MENTIONS' | 'COMMENTS' | 'COLLECTS'>('ALL');

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <div className="flex flex-grow justify-center px-0 sm:px-6 lg:px-8 py-8">
      <MetaTags title={`Notifications • ${APP_NAME}`} />
      <div className="max-w-4xl w-full space-y-3">
        <div className="flex gap-3 pb-2">
          <TabButton
            name={t`All notifications`}
            icon={<LightningBoltIcon className="w-4 h-4" />}
            active={feedType === 'ALL'}
            onClick={() => {
              setFeedType('ALL');
              Analytics.track(NOTIFICATION.SWITCH_ALL);
            }}
          />
          <TabButton
            name={t`Mentions`}
            icon={<AtSymbolIcon className="w-4 h-4" />}
            active={feedType === 'MENTIONS'}
            onClick={() => {
              setFeedType('MENTIONS');
              Analytics.track(NOTIFICATION.SWITCH_MENTIONS);
            }}
          />
          <TabButton
            name={t`Comments`}
            icon={<ChatAlt2Icon className="w-4 h-4" />}
            active={feedType === 'COMMENTS'}
            onClick={() => {
              setFeedType('COMMENTS');
              Analytics.track(NOTIFICATION.SWITCH_COMMENTS);
            }}
          />
          <TabButton
            name={t`Collects`}
            icon={<CollectionIcon className="w-4 h-4" />}
            active={feedType === 'COLLECTS'}
            onClick={() => {
              setFeedType('COLLECTS');
              Analytics.track(NOTIFICATION.SWITCH_COLLECTS);
            }}
          />
        </div>
        <List feedType={feedType} />
      </div>
    </div>
  );
};

export default Notification;
