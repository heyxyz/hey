import {
  AtSymbolIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { NOTIFICATION } from '@lenster/data/tracking';
import { TabButton } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { Dispatch, FC, SetStateAction } from 'react';
import { NotificationTabType } from 'src/enums';

interface FeedTypeProps {
  setFeedType: Dispatch<SetStateAction<string>>;
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
          active={feedType === NotificationTabType.All}
          type={NotificationTabType.All.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.All)}
        />
        <TabButton
          name={t`Mentions`}
          icon={<AtSymbolIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.Mentions}
          type={NotificationTabType.Mentions.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.Mentions)}
        />
        <TabButton
          name={t`Comments`}
          icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.Comments}
          type={NotificationTabType.Comments.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.Comments)}
        />
        <TabButton
          name={t`Likes`}
          icon={<HeartIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.Likes}
          type={NotificationTabType.Likes.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.Likes)}
        />
        <TabButton
          name={t`Collects`}
          icon={<RectangleStackIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.Collects}
          type={NotificationTabType.Collects.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.Collects)}
        />
      </div>
    </div>
  );
};

export default FeedType;
