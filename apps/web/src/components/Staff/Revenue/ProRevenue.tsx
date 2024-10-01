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

const ProRevenue: FC = () => {
  const getProRevenueStats = async (): Promise<
    { date: string; amount: number }[] | null
  > => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/stats/pro-revenue`,
        { headers: getAuthApiHeaders() }
      );

      return response.data?.result || null;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getProRevenueStats,
    queryKey: ["getProRevenueStats"],
    refetchInterval: 5000
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading pro revenue stats..." />
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load pro revenue stats" />
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
        body="Pro revenue per day for last 30 days"
        title="Pro Revenue"
      />
      <div className="m-5">
        <Bar
          data={{
            datasets: [
              {
                backgroundColor: colors.blue[500],
                borderRadius: 3,
                data: data.map((signup) => signup.amount),
                label: "Amount"
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

export default ProRevenue;
