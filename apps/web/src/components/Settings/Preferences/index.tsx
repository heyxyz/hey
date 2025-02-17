import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { APP_NAME } from "@hey/data/constants";
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@hey/ui";
import type { NextPage } from "next";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import AppIcon from "./AppIcon";
import IncludeLowScore from "./IncludeLowScore";

const PreferencesSettings: NextPage = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Preferences settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <CardHeader
            body={`Update your preferences to control how you can change your
            experience on ${APP_NAME}.`}
            title="Your Preferences"
          />
          <div className="m-5 space-y-5">
            <IncludeLowScore />
          </div>
        </Card>
        <AppIcon />
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
