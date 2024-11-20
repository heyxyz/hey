import NewPost from "@components/Composer/NewPost";
import ExploreFeed from "@components/Explore/ExploreFeed";
import ListFeed from "@components/List/ListFeed";
import { Leafwatch } from "@helpers/leafwatch";
import { HomeFeedType } from "@hey/data/enums";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useHomeTabStore } from "src/store/persisted/useHomeTabStore";
import FeedType from "./FeedType";
import ForYou from "./ForYou";
import Hero from "./Hero";
import PaidActions from "./PaidActions";
import Sidebar from "./Sidebar";
import Timeline from "./Timeline";

const Home: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const { feedType, pinnedList } = useHomeTabStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "home" });
  }, []);

  const loggedInWithProfile = Boolean(currentAccount);

  return (
    <>
      {!loggedInWithProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {loggedInWithProfile ? (
            <>
              <NewPost />
              <FeedType />
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
