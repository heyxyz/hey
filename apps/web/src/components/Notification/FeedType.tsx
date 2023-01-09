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
    <div className="flex justify-between items-center">
      <div className="flex overflow-x-auto gap-3 px-5 pb-2 mt-3 sm:px-0 sm:mt-0 md:pb-0">
        <TabButton
          name={t`All notifications`}
          icon={<LightningBoltIcon className="w-4 h-4" />}
          active={feedType === 'ALL'}
          type="all"
          onClick={() => {
            setFeedType('ALL');
            Analytics.track(NOTIFICATION.SWITCH_ALL);
          }}
        />
        <TabButton
          name={t`Mentions`}
          icon={<AtSymbolIcon className="w-4 h-4" />}
          active={feedType === 'MENTIONS'}
          type="mentions"
          onClick={() => {
            setFeedType('MENTIONS');
            Analytics.track(NOTIFICATION.SWITCH_MENTIONS);
          }}
        />
        <TabButton
          name={t`Comments`}
          icon={<ChatAlt2Icon className="w-4 h-4" />}
          active={feedType === 'COMMENTS'}
          type="comments"
          onClick={() => {
            setFeedType('COMMENTS');
            Analytics.track(NOTIFICATION.SWITCH_COMMENTS);
          }}
        />
        <TabButton
          name={t`Likes`}
          icon={<HeartIcon className="w-4 h-4" />}
          active={feedType === 'LIKES'}
          type="likes"
          onClick={() => {
            setFeedType('LIKES');
            Analytics.track(NOTIFICATION.SWITCH_LIKES);
          }}
        />
        <TabButton
          name={t`Collects`}
          icon={<CollectionIcon className="w-4 h-4" />}
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
