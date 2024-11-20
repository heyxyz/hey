import MetaTags from "@components/Common/MetaTags";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW } from "@hey/data/tracking";
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import StaffSidebar from "../Sidebar";
import AccountsCreated from "./AccountsCreated";
import LensCredits from "./LensCredits";
import Mint from "./Mint";
import NftsMinted from "./NftsMinted";
import SignupPrice from "./SignupPrice";

const Signup: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: "staff-tools",
      subpage: "singup"
    });
  }, []);

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Signup • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <CardHeader title="Signup Stats" />
          <div className="m-5 space-y-5">
            <LensCredits />
            <SignupPrice />
            <NftsMinted />
            <AccountsCreated />
          </div>
        </Card>
        <Mint />
      </GridItemEight>
    </GridLayout>
  );
};

export default Signup;
