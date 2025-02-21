import New from "@components/Shared/Badges/New";
import { HomeFeedType } from "@hey/data/enums";
import { TabButton } from "@hey/ui";
import type { FC, JSX } from "react";
import { useHomeTabStore } from "src/store/persisted/useHomeTabStore";

const FeedType: FC = () => {
  const { feedType, setFeedType } = useHomeTabStore();

  const tabs = [
    { name: "Following", type: HomeFeedType.FOLLOWING },
    {
      badge: <New />,
      name: "For You",
      type: HomeFeedType.FORYOU
    }
  ].filter(
    (
      tab
    ): tab is {
      badge?: JSX.Element;
      name: string;
      type: HomeFeedType;
    } => Boolean(tab)
  );

  return (
    <div className="flex flex-wrap gap-3 px-5 sm:px-0">
      {tabs.map((tab) => (
        <TabButton
          active={feedType === tab.type}
          badge={tab.badge}
          key={tab.type}
          name={tab.name}
          onClick={() => setFeedType(tab.type)}
          showOnSm
        />
      ))}
    </div>
  );
};

export default FeedType;
