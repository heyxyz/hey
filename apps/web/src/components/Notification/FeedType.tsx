import {
  AtSymbolIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { NOTIFICATION } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { type Dispatch, type FC, type SetStateAction } from 'react';
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
          name="All notifications"
          icon={<BellIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.All}
          type={NotificationTabType.All.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.All)}
        />
        <TabButton
          name="Mentions"
          icon={<AtSymbolIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.Mentions}
          type={NotificationTabType.Mentions.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.Mentions)}
        />
        <TabButton
          name="Comments"
          icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.Comments}
          type={NotificationTabType.Comments.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.Comments)}
        />
        <TabButton
          name="Likes"
          icon={<HeartIcon className="h-4 w-4" />}
          active={feedType === NotificationTabType.Likes}
          type={NotificationTabType.Likes.toLowerCase()}
          onClick={() => switchTab(NotificationTabType.Likes)}
        />
        <TabButton
          name="Collects"
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
