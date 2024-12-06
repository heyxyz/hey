import MetaTags from "@components/Common/MetaTags";
import WhoToFollow from "@components/Home/Sidebar/WhoToFollow";
import FeedFocusType from "@components/Shared/FeedFocusType";
import Footer from "@components/Shared/Footer";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { APP_NAME } from "@hey/data/constants";
import type { MainContentFocus } from "@hey/indexer";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import BookmarksFeed from "./BookmarksFeed";

const Bookmarks: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Bookmarks • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <FeedFocusType focus={focus} setFocus={setFocus} />
        <BookmarksFeed focus={focus} />
      </GridItemEight>
      <GridItemFour>
        <WhoToFollow />
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Bookmarks;
