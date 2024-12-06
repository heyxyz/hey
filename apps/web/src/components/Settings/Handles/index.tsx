import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import Slug from "@components/Shared/Slug";
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
import LinkHandle from "./LinkHandle";
import UnlinkHandle from "./UnlinkHandle";

const HandlesSettings: NextPage = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Handles settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        {currentAccount.username ? (
          <Card>
            <CardHeader
              body="Unlinking your handle removes it from your profile, ensuring it
              is no longer publicly displayed or associated with your profile."
              title={
                <span>
                  Unlink <Slug slug={currentAccount.username?.localName} /> from
                  your profile
                </span>
              }
            />
            <UnlinkHandle />
          </Card>
        ) : null}
        <Card>
          <CardHeader
            body="Linking your handle to your profile showcases it publicly,
            allowing others to easily identify and connect with you based on
            your unique online identity."
            title="Link a handle"
          />
          <LinkHandle />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default HandlesSettings;
