import MetaTags from "@components/Common/MetaTags";
import { APP_NAME } from "@hey/data/constants";
import { GridLayout } from "@hey/ui";
import { GridItemTwelve } from "@hey/ui/src/GridLayout";
import type { NextPage } from "next";
import NewTicket from "./NewTicket";

const Support: NextPage = () => {
  return (
    <GridLayout>
      <MetaTags title={`Support • ${APP_NAME}`} />
      <GridItemTwelve>
        <NewTicket />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Support;
