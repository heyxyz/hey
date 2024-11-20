import MetaTags from "@components/Common/MetaTags";
import Footer from "@components/Shared/Footer";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import getList, { GET_LIST_QUERY_KEY } from "@hey/helpers/api/lists/getList";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Accounts from "./Accounts";
import Details from "./Details";
import ListFeed from "./ListFeed";
import ListPageShimmer from "./Shimmer";

const ViewList: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { id }
  } = useRouter();
  const { currentAccount } = useAccountStore();
  const showProfiles = pathname === "/lists/[id]/accounts";

  useEffect(() => {
    if (isReady) {
      Leafwatch.track(PAGEVIEW, {
        page: "list",
        subpage: pathname.replace("/lists/[id]", "")
      });
    }
  }, [id]);

  const {
    data: list,
    error,
    isLoading: listLoading
  } = useQuery({
    enabled: Boolean(id),
    queryFn: () => getList({ id: id as string, viewingId: currentAccount?.id }),
    queryKey: [GET_LIST_QUERY_KEY, id]
  });

  if (!isReady || listLoading) {
    return <ListPageShimmer profileList={showProfiles} />;
  }

  if (!list) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <>
      <MetaTags
        description={list.description || ""}
        title={`${list.name} • ${APP_NAME}`}
      />
      <GridLayout>
        <GridItemEight className="space-y-5">
          {showProfiles ? (
            <Accounts listId={list.id} name={list.name} />
          ) : (
            <ListFeed list={list} />
          )}
        </GridItemEight>
        <GridItemFour>
          <Details list={list} />
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default ViewList;
