import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { AnalyticsTabType } from "@hey/data/enums";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridItemTwelve, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import AnalyticsType from "./AnalyticsType";
import Impressions from "./Impressions";
import Overview from "./Overview";

const Analytics: NextPage = () => {
  const {
    query: { type }
  } = useRouter();
  const { currentAccount } = useAccountStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "analytics" });
  }, []);

  const lowerCaseAnalyticsTabType = [
    AnalyticsTabType.Overview.toLowerCase(),
    AnalyticsTabType.Impressions.toLowerCase()
  ];

  const tabType = type
    ? lowerCaseAnalyticsTabType.includes(type as string)
      ? type.toString().toUpperCase()
      : AnalyticsTabType.Overview
    : AnalyticsTabType.Overview;

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Analytics • Impressions • ${APP_NAME}`} />
      <GridItemTwelve className="space-y-5">
        <AnalyticsType tabType={tabType as AnalyticsTabType} />
        {tabType === AnalyticsTabType.Overview && <Overview />}
        {tabType === AnalyticsTabType.Impressions && <Impressions />}
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Analytics;
