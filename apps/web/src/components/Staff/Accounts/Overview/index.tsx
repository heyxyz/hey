import MetaTags from "@components/Common/MetaTags";
import Loader from "@components/Shared/Loader";
import AccountStaffTool from "@components/Staff/Accounts/Overview/Tool";
import StaffSidebar from "@components/Staff/Sidebar";
import { UserIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { useAccountQuery } from "@hey/indexer";
import {
  Card,
  EmptyState,
  ErrorMessage,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Custom404 from "src/pages/404";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const Overview: NextPage = () => {
  const {
    isReady,
    query: { address }
  } = useRouter();
  const { currentAccount } = useAccountStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  const { data, error, loading } = useAccountQuery({
    skip: !address || !isReady,
    variables: { request: { address: address } }
  });

  const account = data?.account;

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Account Overview • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="!bg-yellow-300/20 border-yellow-600 border-dashed p-5">
          {loading ? (
            <Loader className="my-5" message="Loading account" />
          ) : account ? (
            error ? (
              <ErrorMessage error={error} />
            ) : (
              <AccountStaffTool account={account} />
            )
          ) : (
            <EmptyState
              hideCard
              icon={<UserIcon className="size-8" />}
              message="No account found"
            />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
