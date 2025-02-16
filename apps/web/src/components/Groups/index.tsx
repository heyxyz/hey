import MetaTags from "@components/Common/MetaTags";
import Footer from "@components/Shared/Footer";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { APP_NAME } from "@hey/data/constants";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import List from "./List";
import ListFocusType from "./ListFocusType";
import CreateGroup from "./Sidebar/Create/CreateGroup";

export enum GroupsTabFocus {
  Member = "MEMBER",
  Managed = "MANAGED"
}

const Groups: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<GroupsTabFocus>(GroupsTabFocus.Member);

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Groups • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <ListFocusType focus={focus} setFocus={setFocus} />
        <List focus={focus} />
      </GridItemEight>
      <GridItemFour>
        <CreateGroup />
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Groups;
