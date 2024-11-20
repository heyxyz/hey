import MetaTags from "@components/Common/MetaTags";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW } from "@hey/data/tracking";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import StaffSidebar from "../Sidebar";
import LeafwatchStats from "./LeafwatchStats";
import Links from "./Links";

const Overview: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "staff-tools", subpage: "overview" });
  }, []);

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Overview • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <LeafwatchStats />
        </Card>
        <Card className="p-5">
          <Links />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
