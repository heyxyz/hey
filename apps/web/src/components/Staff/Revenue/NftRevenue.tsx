import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL, IS_MAINNET } from "@hey/data/constants";
import formatDate from "@hey/helpers/datetime/formatDate";
import { Card, CardHeader, EmptyState, ErrorMessage } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import type { FC } from "react";
import { Bar } from "react-chartjs-2";
import colors from "tailwindcss/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GET_NFT_REVENUE_STATS_QUERY_KEY = "getNftRevenueStats";

const NftRevenue: FC = () => {
  const getNftRevenueStats = async (): Promise<
    { date: string; count: number }[] | null
  > => {
    try {
      const { data } = await axios.get(
        `${HEY_API_URL}/lens/internal/stats/nft-revenue`,
        { headers: getAuthApiHeaders() }
      );

      return data?.result || null;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getNftRevenueStats,
    queryKey: [GET_NFT_REVENUE_STATS_QUERY_KEY],
    refetchInterval: 5000
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading NFT revenue stats..." />
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load NFT revenue stats" />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={<ChartBarIcon className="size-8" />}
        message="No data available"
      />
    );
  }

  return (
    <Card>
      <CardHeader
        body="NFT revenue per day for last 30 days"
        title="NFT Revenue"
      />
      <div className="m-5">
        <Bar
          data={{
            datasets: [
              {
                backgroundColor: colors.blue[500],
                borderRadius: 3,
                data: data.map((signup) => signup.count),
                label: "Mints"
              }
            ],
            labels: data.map((signup) => formatDate(signup.date, "MMM D"))
          }}
          options={{
            plugins: { legend: { display: false } },
            responsive: true
          }}
        />
      </div>
    </Card>
  );
};

export default NftRevenue;
