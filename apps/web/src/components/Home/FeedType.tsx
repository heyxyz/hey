import New from "@components/Shared/Badges/New";
import { Leafwatch } from "@helpers/leafwatch";
import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import { HomeFeedType } from "@hey/data/enums";
import { HOME } from "@hey/data/tracking";
import { Image, TabButton } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { usePinnedListStore } from "src/store/persisted/usePinnedListStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface FeedTypeProps {
  feedType: HomeFeedType;
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
  pinnedListId: string | null;
  setPinnedListId: Dispatch<SetStateAction<string | null>>;
}

const FeedType: FC<FeedTypeProps> = ({
  feedType,
  setFeedType,
  pinnedListId,
  setPinnedListId
}) => {
  const { fallbackToCuratedFeed } = useProfileStore();
  const { pinnedLists } = usePinnedListStore();

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
          onClick={() => {
            setFeedType(tab.type);
            Leafwatch.track(tab.track);
          }}
          showOnSm
        />
      ))}
      {pinnedLists.length > 0 &&
        pinnedLists.map((pinnedList) => (
          <TabButton
            active={
              feedType === HomeFeedType.PINNED && pinnedListId === pinnedList.id
            }
            key={pinnedList.id}
            name={pinnedList.name}
            icon={
              <Image
                className="size-4 rounded-md"
                height={16}
                width={16}
                src={pinnedList.avatar || PLACEHOLDER_IMAGE}
                alt={pinnedList.name}
              />
            }
            onClick={() => {
              setFeedType(HomeFeedType.PINNED);
              setPinnedListId(pinnedList.id);
              Leafwatch.track(HOME.SWITCH_PINNED_LIST, {
                list: pinnedList.id
              });
            }}
            showOnSm
          />
        ))}
    </div>
  );
};

export default FeedType;
