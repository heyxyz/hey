import MetaTags from "@components/Common/MetaTags";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import Custom404 from "src/pages/404";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import StaffSidebar from "../Sidebar";
import List from "./List";

const Permissions: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Permissions • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight>
        <List />
      </GridItemEight>
    </GridLayout>
  );
};

export default Permissions;
