import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import SettingsSidebar from "../Sidebar";
import CollectModules from "./CollectModules";

const AllowanceSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "settings", subpage: "allowance" });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Allowance settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CollectModules />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default AllowanceSettings;
