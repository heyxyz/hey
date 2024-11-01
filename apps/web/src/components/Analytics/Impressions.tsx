import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import formatDate from "@hey/helpers/datetime/formatDate";
import { Card, CardHeader } from "@hey/ui";
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

const GET_IMPRESSIONS_QUERY_KEY = "getImpressions";

const Impressions: FC = () => {
  const getImpressions = async (): Promise<
    {
      date: string;
      impressions: number;
    }[]
  > => {
    try {
      const { data } = await axios.get(`${HEY_API_URL}/analytics/impressions`, {
        headers: getAuthApiHeaders()
      });

      return data.result;
    } catch {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryFn: getImpressions,
    queryKey: [GET_IMPRESSIONS_QUERY_KEY]
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading impressions" />
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Impressions" />
      <div className="m-5">
        <Bar
          data={{
            datasets: [
              {
                backgroundColor: colors.blue[500],
                data: data.map((stat) => stat.impressions),
                label: "Impressions",
                borderRadius: 5
              }
            ],
            labels: data.map((stat) => formatDate(stat.date, "MMM D"))
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

export default Impressions;
