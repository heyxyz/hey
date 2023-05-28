import {
  AtSymbolIcon,
  BellIcon,
  ChatAlt2Icon,
  CollectionIcon,
  HeartIcon
} from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { NotificationType } from 'src/enums';
import { NOTIFICATION } from 'src/tracking';
import { TabButton } from 'ui';

interface FeedTypeProps {
  setFeedType: Dispatch<string>;
  feedType: string;
}

const FeedType: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const switchTab = (type: string) => {
    setFeedType(type);
    Leafwatch.track(NOTIFICATION.SWITCH_NOTIFICATION_TAB, {
      notification_type: type.toLowerCase()
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        <TabButton
          name={t`All notifications`}
          icon={<BellIcon className="h-4 w-4" />}
          active={feedType === NotificationType.All}
          type={NotificationType.All.toLowerCase()}
          onClick={() => switchTab(NotificationType.All)}
        />
        <TabButton
          name={t`Mentions`}
          icon={<AtSymbolIcon className="h-4 w-4" />}
          active={feedType === NotificationType.Mentions}
          type={NotificationType.Mentions.toLowerCase()}
          onClick={() => switchTab(NotificationType.Mentions)}
        />
        <TabButton
          name={t`Comments`}
          icon={<ChatAlt2Icon className="h-4 w-4" />}
          active={feedType === NotificationType.Comments}
          type={NotificationType.Comments.toLowerCase()}
          onClick={() => switchTab(NotificationType.Comments)}
        />
        <TabButton
          name={t`Likes`}
          icon={<HeartIcon className="h-4 w-4" />}
          active={feedType === NotificationType.Likes}
          type={NotificationType.Likes.toLowerCase()}
          onClick={() => switchTab(NotificationType.Likes)}
        />
        <TabButton
          name={t`Collects`}
          icon={<CollectionIcon className="h-4 w-4" />}
          active={feedType === NotificationType.Collects}
          type={NotificationType.Collects.toLowerCase()}
          onClick={() => switchTab(NotificationType.Collects)}
        />
      </div>
    </div>
  );
};

export default FeedType;
