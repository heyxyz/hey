import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Card, CardHeader, ErrorMessage, NumberedStat } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

export interface LensStatsType {
  authentications_count: string;
  relay_usage_count: string;
  publications_count: string;
  profiles_count: string;
  bookmarked_publications_count: string;
  not_interested_publications_count: string;
  wtf_recommendation_dismissed_count: string;
  notifications_count: string;
  momoka_count: string;
  media_snapshots_count: string;
  quality_profiles_count: string;
  indexed_transactions_count: string;
  hashtags_count: string;
  mentions_count: string;
  ens_count: string;
  gardener_reports_count: string;
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
    queryKey: ["getLensStats"],
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
          count={data.authentications_count}
          name="Authentications"
        />
        <NumberedStat count={data.relay_usage_count} name="Relay Usage" />
        <NumberedStat count={data.publications_count} name="Publications" />
        <NumberedStat count={data.profiles_count} name="Profiles" />
        <NumberedStat
          count={data.quality_profiles_count}
          name="Quality Profiles"
        />
        <NumberedStat
          count={data.bookmarked_publications_count}
          name="Bookmarkes"
        />
        <NumberedStat
          count={data.not_interested_publications_count}
          name="Not Interested"
        />
        <NumberedStat
          count={data.wtf_recommendation_dismissed_count}
          name="WTF Dismissed"
        />
        <NumberedStat count={data.notifications_count} name="Notifications" />
        <NumberedStat count={data.momoka_count} name="Momoka Publications" />
        <NumberedStat
          count={data.media_snapshots_count}
          name="Media Snapshots"
        />
        <NumberedStat
          count={data.indexed_transactions_count}
          name="Indexed Transactions"
        />
        <NumberedStat count={data.hashtags_count} name="Hashtags" />
        <NumberedStat count={data.mentions_count} name="Mentions" />
        <NumberedStat count={data.ens_count} name="ENS" />
        <NumberedStat
          count={data.gardener_reports_count}
          name="Gardener Reports"
        />
      </div>
    </Card>
  );
};

export default LensStats;
