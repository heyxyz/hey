import MetaTags from "@components/Common/MetaTags";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import StaffSidebar from "../Sidebar";
import HeyStats from "./HeyStats";
import LensStats from "./LensStats";

const Stats: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "staff-tools", subpage: "stats" });
  }, []);

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Stats • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <HeyStats />
        <LensStats />
      </GridItemEight>
    </GridLayout>
  );
};

export default Stats;
