import TabButton from '@components/UI/TabButton';
import {
  AtSymbolIcon,
  ChatAlt2Icon,
  CollectionIcon,
  HeartIcon,
  LightningBoltIcon
} from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { NOTIFICATION } from 'src/tracking';

interface Props {
  setFeedType: Dispatch<string>;
  feedType: string;
}

const FeedType: FC<Props> = ({ setFeedType, feedType }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        <TabButton
          name={t`All notifications`}
          icon={<LightningBoltIcon className="h-4 w-4" />}
          active={feedType === 'ALL'}
          type="all"
          onClick={() => {
            setFeedType('ALL');
            Analytics.track(NOTIFICATION.SWITCH_ALL);
          }}
        />
        <TabButton
          name={t`Mentions`}
          icon={<AtSymbolIcon className="h-4 w-4" />}
          active={feedType === 'MENTIONS'}
          type="mentions"
          onClick={() => {
            setFeedType('MENTIONS');
            Analytics.track(NOTIFICATION.SWITCH_MENTIONS);
          }}
        />
        <TabButton
          name={t`Comments`}
          icon={<ChatAlt2Icon className="h-4 w-4" />}
          active={feedType === 'COMMENTS'}
          type="comments"
          onClick={() => {
            setFeedType('COMMENTS');
            Analytics.track(NOTIFICATION.SWITCH_COMMENTS);
          }}
        />
        <TabButton
          name={t`Likes`}
          icon={<HeartIcon className="h-4 w-4" />}
          active={feedType === 'LIKES'}
          type="likes"
          onClick={() => {
            setFeedType('LIKES');
            Analytics.track(NOTIFICATION.SWITCH_LIKES);
          }}
        />
        <TabButton
          name={t`Collects`}
          icon={<CollectionIcon className="h-4 w-4" />}
          active={feedType === 'COLLECTS'}
          type="collects"
          onClick={() => {
            setFeedType('COLLECTS');
            Analytics.track(NOTIFICATION.SWITCH_COLLECTS);
          }}
        />
      </div>
    </div>
  );
};

export default FeedType;
