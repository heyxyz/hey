import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Card, CardHeader, ErrorMessage, NumberedStat } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

const GET_LENS_STATS_QUERY_KEY = "getLensStats";

interface LensStatsType {
  authenticationsCount: string;
  relayUsageCount: string;
  postsCount: string;
  profilesCount: string;
  bookmarkedPostsCount: string;
  notInterestedPostsCount: string;
  wtfRecommendationDismissedCount: string;
  notificationsCount: string;
  momokaCount: string;
  mediaSnapshotsCount: string;
  qualityProfilesCount: string;
  indexedTransactionsCount: string;
  hashtagsCount: string;
  mentionsCount: string;
  ensCount: string;
  gardenerReportsCount: string;
}

const LensStats: FC = () => {
  const getLensStats = async (): Promise<LensStatsType> => {
    const response: {
      data: { result: LensStatsType };
    } = await axios.get(`${HEY_API_URL}/lens/internal/stats/overview`, {
      headers: getAuthApiHeaders()
    });

    return response.data.result;
  };

  const { data, error, isLoading } = useQuery({
    queryFn: getLensStats,
    queryKey: [GET_LENS_STATS_QUERY_KEY],
    refetchInterval: 5000
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading lens stats..." />
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load stats" />;
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Lens Stats" />
      <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <NumberedStat
          count={data.authenticationsCount}
          name="Authentications"
        />
        <NumberedStat count={data.relayUsageCount} name="Relay Usage" />
        <NumberedStat count={data.postsCount} name="Posts" />
        <NumberedStat count={data.profilesCount} name="Profiles" />
        <NumberedStat
          count={data.qualityProfilesCount}
          name="Quality Profiles"
        />
        <NumberedStat count={data.bookmarkedPostsCount} name="Bookmarkes" />
        <NumberedStat
          count={data.notInterestedPostsCount}
          name="Not Interested"
        />
        <NumberedStat
          count={data.wtfRecommendationDismissedCount}
          name="WTF Dismissed"
        />
        <NumberedStat count={data.notificationsCount} name="Notifications" />
        <NumberedStat count={data.momokaCount} name="Momoka Posts" />
        <NumberedStat count={data.mediaSnapshotsCount} name="Media Snapshots" />
        <NumberedStat
          count={data.indexedTransactionsCount}
          name="Indexed Transactions"
        />
        <NumberedStat count={data.hashtagsCount} name="Hashtags" />
        <NumberedStat count={data.mentionsCount} name="Mentions" />
        <NumberedStat count={data.ensCount} name="ENS" />
        <NumberedStat
          count={data.gardenerReportsCount}
          name="Gardener Reports"
        />
      </div>
    </Card>
  );
};

export default LensStats;
