import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Card, CardHeader } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

const Overview: FC = () => {
  const getAnalyticsOverview = async (): Promise<
    {
      date: string;
      likes: number;
      comments: number;
      collects: number;
      mirrors: number;
      quotes: number;
      mentions: number;
      follows: number;
      bookmarks: number;
    }[]
  > => {
    try {
      const response = await axios.get(`${HEY_API_URL}/analytics/overview`, {
        headers: getAuthApiHeaders()
      });

      return response.data.result;
    } catch {
      return [];
    }
  };

  const { data } = useQuery({
    queryFn: getAnalyticsOverview,
    queryKey: ["getAnalyticsOverview"]
  });

  return (
    <Card>
      <CardHeader title="Overview" />
      <div className="m-5">{JSON.stringify(data)}</div>
    </Card>
  );
};

export default Overview;
