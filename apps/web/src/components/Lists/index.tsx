import MetaTags from "@components/Common/MetaTags";
import WhoToFollow from "@components/Home/Sidebar/WhoToFollow";
import Footer from "@components/Shared/Footer";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";

const Lists: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "lists" });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Lists • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">WIP</GridItemEight>
      <GridItemFour>
        <WhoToFollow />
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Lists;
