import {
  AtSymbolIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";
import { NotificationFeedType } from "@hey/data/enums";
import { TabButton } from "@hey/ui";
import type { FC } from "react";

interface FeedTypeProps {
  feedType: NotificationFeedType;
}

const FeedType: FC<FeedTypeProps> = ({ feedType }) => {
  const tabs = [
    {
      icon: <BellIcon className="size-4" />,
      name: "All notifications",
      type: NotificationFeedType.All
    },
    {
      icon: <AtSymbolIcon className="size-4" />,
      name: "Mentions",
      type: NotificationFeedType.Mentions
    },
    {
      icon: <ChatBubbleLeftIcon className="size-4" />,
      name: "Comments",
      type: NotificationFeedType.Comments
    },
    {
      icon: <HeartIcon className="size-4" />,
      name: "Likes",
      type: NotificationFeedType.Likes
    },
    {
      icon: <ShoppingBagIcon className="size-4" />,
      name: "Collects",
      type: NotificationFeedType.Actions
    }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        {tabs.map((tab) => (
          <TabButton
            active={feedType === tab.type}
            icon={tab.icon}
            key={tab.type}
            name={tab.name}
            type={tab.type.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedType;
