import MetaTags from "@components/Common/MetaTags";
import WhoToFollow from "@components/Home/Sidebar/WhoToFollow";
import FeedFocusType from "@components/Shared/FeedFocusType";
import Footer from "@components/Shared/Footer";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import type { PublicationMetadataMainFocusType } from "@hey/lens";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import BookmarksFeed from "./BookmarksFeed";

const Bookmarks: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "bookmarks" });
  }, []);

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
