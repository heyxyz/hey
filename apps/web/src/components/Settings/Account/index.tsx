import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { APP_NAME } from "@hey/data/constants";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import RateLimits from "./RateLimits";
import SuperFollowPayment from "./SuperFollowPayment";
import SuperFollowToken from "./SuperFollowToken";
import Verification from "./Verification";

const AccountSettings: NextPage = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Account settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <SuperFollowPayment />
        <SuperFollowToken />
        <RateLimits />
        <Verification />
      </GridItemEight>
    </GridLayout>
  );
};

export default AccountSettings;
