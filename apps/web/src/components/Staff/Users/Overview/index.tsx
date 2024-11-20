import MetaTags from "@components/Common/MetaTags";
import Loader from "@components/Shared/Loader";
import StaffSidebar from "@components/Staff/Sidebar";
import AccountStaffTool from "@components/Staff/Users/Overview/Tool";
import { Leafwatch } from "@helpers/leafwatch";
import { UserIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW } from "@hey/data/tracking";
import type { Profile } from "@hey/lens";
import { useProfileQuery } from "@hey/lens";
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
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const Overview: NextPage = () => {
  const {
    isReady,
    query: { id }
  } = useRouter();
  const { currentAccount } = useAccountStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: "staff-tools",
      subpage: "profile-overview"
    });
  }, []);

  const { data, error, loading } = useProfileQuery({
    skip: !id || !isReady,
    variables: { request: { forProfileId: id } }
  });
  const account = data?.profile as Profile;

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Profile Overview • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="!bg-yellow-300/20 border-yellow-600 border-dashed p-5">
          {loading ? (
            <Loader className="my-5" message="Loading profile" />
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
              message="No profile found"
            />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
