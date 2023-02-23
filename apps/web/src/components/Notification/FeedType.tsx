import TabButton from '@components/UI/TabButton';
import {
  AtSymbolIcon,
  ChatAlt2Icon,
  CollectionIcon,
  HeartIcon,
  LightningBoltIcon
} from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { NOTIFICATION } from 'src/tracking';

enum NotificationType {
  ALL = 'ALL',
  MENTIONS = 'MENTIONS',
  COMMENTS = 'COMMENTS',
  LIKES = 'LIKES',
  COLLECTS = 'COLLECTS'
}

interface Props {
  setFeedType: Dispatch<string>;
  feedType: string;
}

const FeedType: FC<Props> = ({ setFeedType, feedType }) => {
  const switchTab = (type: string) => {
    setFeedType(type);
    Mixpanel.track(NOTIFICATION.SWITCH_NOTIFICATION_TAB, {
      notification_type: type.toLowerCase()
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        <TabButton
          name={t`All notifications`}
          icon={<LightningBoltIcon className="h-4 w-4" />}
          active={feedType === NotificationType.ALL}
          type={NotificationType.ALL.toLowerCase()}
          onClick={() => switchTab(NotificationType.ALL)}
        />
        <TabButton
          name={t`Mentions`}
          icon={<AtSymbolIcon className="h-4 w-4" />}
          active={feedType === NotificationType.MENTIONS}
          type={NotificationType.MENTIONS.toLowerCase()}
          onClick={() => switchTab(NotificationType.MENTIONS)}
        />
        <TabButton
          name={t`Comments`}
          icon={<ChatAlt2Icon className="h-4 w-4" />}
          active={feedType === NotificationType.COMMENTS}
          type={NotificationType.COMMENTS.toLowerCase()}
          onClick={() => switchTab(NotificationType.COMMENTS)}
        />
        <TabButton
          name={t`Likes`}
          icon={<HeartIcon className="h-4 w-4" />}
          active={feedType === NotificationType.LIKES}
          type={NotificationType.LIKES.toLowerCase()}
          onClick={() => switchTab(NotificationType.LIKES)}
        />
        <TabButton
          name={t`Collects`}
          icon={<CollectionIcon className="h-4 w-4" />}
          active={feedType === NotificationType.COLLECTS}
          type={NotificationType.COLLECTS.toLowerCase()}
          onClick={() => switchTab(NotificationType.COLLECTS)}
        />
      </div>
    </div>
  );
};

export default FeedType;
