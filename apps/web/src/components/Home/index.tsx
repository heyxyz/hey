import NewPost from "@components/Composer/NewPost";
import ExploreFeed from "@components/Explore/ExploreFeed";
import ListFeed from "@components/List/ListFeed";
import { Leafwatch } from "@helpers/leafwatch";
import { HomeFeedType } from "@hey/data/enums";
import { PAGEVIEW } from "@hey/data/tracking";
import type { List } from "@hey/types/hey";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import FeedType from "./FeedType";
import ForYou from "./ForYou";
import Hero from "./Hero";
import PaidActions from "./PaidActions";
import Sidebar from "./Sidebar";
import Timeline from "./Timeline";

const Home: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );
  const [pinnedList, setPinnedList] = useState<List | null>(null);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "home" });
  }, []);

  const loggedInWithProfile = Boolean(currentProfile);

  return (
    <>
      {!loggedInWithProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {loggedInWithProfile ? (
            <>
              <NewPost />
              <FeedType
                feedType={feedType}
                setFeedType={setFeedType}
                pinnedList={pinnedList}
                setPinnedList={setPinnedList}
              />
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.FORYOU ? (
                <ForYou />
              ) : feedType === HomeFeedType.PREMIUM ? (
                <PaidActions />
              ) : feedType === HomeFeedType.PINNED && pinnedList ? (
                <ListFeed list={pinnedList} showHeader />
              ) : null}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
