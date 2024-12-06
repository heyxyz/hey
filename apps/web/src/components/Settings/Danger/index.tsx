import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import WrongWallet from "@components/Shared/Settings/WrongWallet";
import { APP_NAME } from "@hey/data/constants";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useAccount } from "wagmi";
import SettingsSidebar from "../Sidebar";
import DeleteSettings from "./Delete";

const DangerSettings: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const { address } = useAccount();
  const disabled = currentAccount?.owner !== address;

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Delete Account • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        {disabled ? <WrongWallet /> : <DeleteSettings />}
      </GridItemEight>
    </GridLayout>
  );
};

export default DangerSettings;
