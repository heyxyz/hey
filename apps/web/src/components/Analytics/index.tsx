import MetaTags from "@components/Common/MetaTags";
import Pro from "@components/Pro";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridLayout, PageLoading } from "@hey/ui";
import { GridItemTwelve } from "@hey/ui/src/GridLayout";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AnalyticsTabType } from "src/enums";
import { useProStore } from "src/store/non-persisted/useProStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import AnalyticsType from "./AnalyticsType";
import Impressions from "./Impressions";
import Overview from "./Overview";

const Analytics: NextPage = () => {
  const {
    query: { type }
  } = useRouter();
  const { currentProfile } = useProfileStore();
  const { isPro, loading } = useProStore();

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

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (loading) {
    return <PageLoading />;
  }

  if (!isPro) {
    return <Pro />;
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
