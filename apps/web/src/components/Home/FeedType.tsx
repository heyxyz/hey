import New from "@components/Shared/Badges/New";
import { Leafwatch } from "@helpers/leafwatch";
import { HomeFeedType } from "@hey/data/enums";
import { FeatureFlag } from "@hey/data/feature-flags";
import { HOME } from "@hey/data/tracking";
import { TabButton } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { Dispatch, FC, SetStateAction } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface FeedTypeProps {
  feedType: HomeFeedType;
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  const { fallbackToCuratedFeed } = useProfileStore();
  const isGardener = useFlag(FeatureFlag.Gardener);
  const isLensTeam = useFlag(FeatureFlag.LensTeam);
  const enabled = isGardener || isLensTeam;

  const tabs = [
    {
      name: fallbackToCuratedFeed ? "Curated Feed" : "Following",
      track: HOME.SWITCH_FOLLOWING_FEED,
      type: HomeFeedType.FOLLOWING
    },
    enabled && {
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
    <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
      {tabs.map((tab) => (
        <TabButton
          active={feedType === tab.type}
          badge={tab.badge}
          key={tab.type}
          name={tab.name}
          onClick={() => {
            setFeedType(tab.type);
            Leafwatch.track(tab.track);
          }}
          showOnSm
        />
      ))}
    </div>
  );
};

export default FeedType;
