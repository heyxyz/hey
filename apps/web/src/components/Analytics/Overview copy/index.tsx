import MetaTags from "@components/Common/MetaTags";
import Pro from "@components/Pro";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridLayout, PageLoading } from "@hey/ui";
import { GridItemTwelve } from "@hey/ui/src/GridLayout";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useProStore } from "src/store/non-persisted/useProStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import Graph from "./Graph";

const Overview: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { isPro, loading } = useProStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "analytics" });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (loading) {
    return <PageLoading />;
  }

  if (!isPro) {
    return <Pro />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Analytics • Overview • ${APP_NAME}`} />
      <GridItemTwelve className="space-y-5">
        <Graph />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Overview;
