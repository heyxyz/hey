import MetaTags from "@components/Common/MetaTags";
import { APP_NAME } from "@hey/data/constants";
import { GridLayout, PageLoading } from "@hey/ui";
import { GridItemTwelve } from "@hey/ui/src/GridLayout";
import type { NextPage } from "next";
import { usePreferencesStore } from "src/store/non-persisted/usePreferencesStore";
import NewTicket from "./NewTicket";

const Support: NextPage = () => {
  const { loading } = usePreferencesStore();

  if (loading) {
    return <PageLoading />;
  }

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
