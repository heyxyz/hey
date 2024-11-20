import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@hey/ui";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import AppIcon from "./AppIcon";
import DeveloperMode from "./DeveloperMode";
import HighSignalNotificationFilter from "./HighSignalNotificationFilter";
import MutedWords from "./MutedWords";

const PreferencesSettings: NextPage = () => {
  const { currentAccount } = useAccountStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "settings", subpage: "preferences" });
  }, []);

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
            <HighSignalNotificationFilter />
            <DeveloperMode />
          </div>
        </Card>
        <AppIcon />
        <MutedWords />
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
