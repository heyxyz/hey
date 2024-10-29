import New from "@components/Shared/Badges/New";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { AVATAR, HEY_API_URL, PLACEHOLDER_IMAGE } from "@hey/data/constants";
import { HomeFeedType } from "@hey/data/enums";
import { HOME } from "@hey/data/tracking";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { List } from "@hey/types/hey";
import { Image, TabButton } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Dispatch, FC, SetStateAction } from "react";
import { usePinnedListStore } from "src/store/persisted/usePinnedListStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";

const GET_PINNED_LISTS_QUERY_KEY = "getPinnedLists";

interface FeedTypeProps {
  feedType: HomeFeedType;
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
  pinnedList: List | null;
  setPinnedList: Dispatch<SetStateAction<List | null>>;
}

const FeedType: FC<FeedTypeProps> = ({
  feedType,
  setFeedType,
  pinnedList,
  setPinnedList
}) => {
  const { fallbackToCuratedFeed } = useProfileStore();
  const { pinnedLists, setPinnedLists } = usePinnedListStore();

  const getPinnedLists = async (): Promise<List[]> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/lists/pinned`, {
        headers: getAuthApiHeaders()
      });

      const lists = response.data?.result;
      setPinnedLists(lists);
      return lists;
    } catch {
      return [];
    }
  };

  useQuery({
    queryFn: getPinnedLists,
    queryKey: [GET_PINNED_LISTS_QUERY_KEY]
  });

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
        pinnedLists.map((list) => (
          <TabButton
            active={
              feedType === HomeFeedType.PINNED && list.id === pinnedList?.id
            }
            key={list.id}
            name={list.name}
            icon={
              <Image
                className="size-4 rounded-md"
                height={16}
                width={16}
                src={
                  list.avatar
                    ? imageKit(sanitizeDStorageUrl(list.avatar), AVATAR)
                    : PLACEHOLDER_IMAGE
                }
                alt={list.name}
              />
            }
            onClick={() => {
              setFeedType(HomeFeedType.PINNED);
              setPinnedList(list);
              Leafwatch.track(HOME.SWITCH_PINNED_LIST, {
                list: list.id
              });
            }}
            showOnSm
          />
        ))}
    </div>
  );
};

export default FeedType;
