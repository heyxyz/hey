import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { APP_NAME, HEY_API_URL } from "@hey/data/constants";
import { Card, CardHeader, ErrorMessage, NumberedStat } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

const GET_HEY_STATS_QUERY_KEY = "getHeyStats";

interface HeyStatsType {
  accountPermissions: number;
  emails: number;
  membershipNfts: number;
  polls: number;
  pollOptions: number;
  pollResponses: number;
  preferences: number;
  accountStatuses: number;
  profileThemes: number;
}

const HeyStats: FC = () => {
  const getHeyStats = async (): Promise<HeyStatsType> => {
    const response: {
      data: { result: HeyStatsType };
    } = await axios.get(`${HEY_API_URL}/internal/stats/overview`, {
      headers: getAuthApiHeaders()
    });

    return response.data.result;
  };

  const { data, error, isLoading } = useQuery({
    queryFn: getHeyStats,
    queryKey: [GET_HEY_STATS_QUERY_KEY],
    refetchInterval: 5000
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message={`Loading ${APP_NAME} stats...`} />
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
      <CardHeader title={`${APP_NAME} Stats`} />
      <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <NumberedStat
          count={data.accountPermissions.toString()}
          name="Account Permissions"
        />
        <NumberedStat
          count={data.accountStatuses.toString()}
          name="Account Statuses"
        />
        <NumberedStat
          count={data.profileThemes.toString()}
          name="Account Themes"
        />
        <NumberedStat count={data.polls.toString()} name="Polls" />
        <NumberedStat count={data.pollOptions.toString()} name="Poll Options" />
        <NumberedStat
          count={data.pollResponses.toString()}
          name="Poll Responses"
        />
        <NumberedStat count={data.preferences.toString()} name="Preferences" />
        <NumberedStat count={data.emails.toString()} name="Emails" />
        <NumberedStat
          count={data.membershipNfts.toString()}
          name="Membership NFTs"
        />
      </div>
    </Card>
  );
};

export default HeyStats;
