import New from "@components/Shared/Badges/New";
import { HomeFeedType } from "@hey/data/enums";
import { HOME } from "@hey/data/tracking";
import { TabButton } from "@hey/ui";
import type { FC, JSX } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useHomeTabStore } from "src/store/persisted/useHomeTabStore";

const FeedType: FC = () => {
  const { fallbackToCuratedFeed } = useAccountStore();
  const { feedType, setFeedType } = useHomeTabStore();

  const tabs = [
    {
      name: fallbackToCuratedFeed ? "Curated Feed" : "Following",
      track: HOME.SWITCH_FOLLOWING_FEED,
      type: HomeFeedType.FOLLOWING
    },
    {
      badge: <New />,
      name: "For You",
      track: HOME.SWITCH_FORYOU_FEED,
      type: HomeFeedType.FORYOU
    },
    {
      name: "Premium",
      track: HOME.SWITCH_PREMIUM_FEED,
      type: HomeFeedType.PREMIUM
    }
  ].filter(
    (
      tab
    ): tab is {
      badge?: JSX.Element;
      name: string;
      track: string;
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
