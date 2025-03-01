import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { APP_NAME } from "@hey/data/constants";
import { useGroupQuery } from "@hey/indexer";
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout,
  PageLoading
} from "@hey/ui";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import List from "./List";

const BanSettings: NextPage = () => {
  const {
    isReady,
    query: { address }
  } = useRouter();
  const { currentAccount } = useAccountStore();

  const { data, loading, error } = useGroupQuery({
    variables: { request: { group: address } },
    skip: !address
  });

  if (!isReady || loading) {
    return <PageLoading />;
  }

  if (error) {
    return <Custom500 />;
  }

  const group = data?.group;

  if (!group || currentAccount?.address !== group.owner) {
    return <Custom404 />;
  }

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Approval settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar group={group} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <CardHeader
            body="This is a list of membership requests. You can approve or reject them at any time."
            title="Membership requests"
          />
          <List group={group} />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default BanSettings;
