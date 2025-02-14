import MetaTags from "@components/Common/MetaTags";
import Footer from "@components/Shared/Footer";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { APP_NAME } from "@hey/data/constants";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import CreateGroup from "./Sidebar/CreateGroup";

const Groups: NextPage = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Groups • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Card>WIP</Card>
      </GridItemEight>
      <GridItemFour>
        <CreateGroup />
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Groups;
