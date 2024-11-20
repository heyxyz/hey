import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import WrongWallet from "@components/Shared/Settings/WrongWallet";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useAccount } from "wagmi";
import SettingsSidebar from "../Sidebar";
import AccountManager from "./AccountManager";
import LensManager from "./LensManager";

const ManagerSettings: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const { address } = useAccount();
  const disabled = currentAccount?.ownedBy.address !== address;

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "settings", subpage: "manager" });
  }, []);

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Manager • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        {disabled ? (
          <WrongWallet />
        ) : (
          <>
            <LensManager />
            <AccountManager />
          </>
        )}
      </GridItemEight>
    </GridLayout>
  );
};

export default ManagerSettings;
