import type { FC } from 'react';

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
import { NotificationTabType } from 'src/enums';

interface FeedTypeProps {
  feedType: string;
}

const FeedType: FC<FeedTypeProps> = ({ feedType }) => {
  const switchTab = (type: string) => {
    Leafwatch.track(NOTIFICATION.SWITCH_NOTIFICATION_TAB, {
      notification_type: type.toLowerCase()
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        <TabButton
          active={feedType === NotificationTabType.All}
          icon={<BellIcon className="size-4" />}
          name="All notifications"
          onClick={() => switchTab(NotificationTabType.All)}
          type={NotificationTabType.All.toLowerCase()}
        />
        <TabButton
          active={feedType === NotificationTabType.Mentions}
          icon={<AtSymbolIcon className="size-4" />}
          name="Mentions"
          onClick={() => switchTab(NotificationTabType.Mentions)}
          type={NotificationTabType.Mentions.toLowerCase()}
        />
        <TabButton
          active={feedType === NotificationTabType.Comments}
          icon={<ChatBubbleLeftRightIcon className="size-4" />}
          name="Comments"
          onClick={() => switchTab(NotificationTabType.Comments)}
          type={NotificationTabType.Comments.toLowerCase()}
        />
        <TabButton
          active={feedType === NotificationTabType.Likes}
          icon={<HeartIcon className="size-4" />}
          name="Likes"
          onClick={() => switchTab(NotificationTabType.Likes)}
          type={NotificationTabType.Likes.toLowerCase()}
        />
        <TabButton
          active={feedType === NotificationTabType.Collects}
          icon={<RectangleStackIcon className="size-4" />}
          name="Collects"
          onClick={() => switchTab(NotificationTabType.Collects)}
          type={NotificationTabType.Collects.toLowerCase()}
        />
      </div>
    </div>
  );
};

export default FeedType;
