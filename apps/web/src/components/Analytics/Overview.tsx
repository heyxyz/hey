import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import formatDate from "@hey/helpers/datetime/formatDate";
import { Card, CardHeader, Select } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { useTheme } from "next-themes";
import { type FC, useState } from "react";
import { Line } from "react-chartjs-2";
import colors from "tailwindcss/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Overview: FC = () => {
  const [primaryType, setPrimaryType] = useState<string>("Likes");
  const [secondaryType, setSecondaryType] = useState<string>("Comments");
  const { resolvedTheme } = useTheme();

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

  const { data, isLoading } = useQuery({
    queryFn: getAnalyticsOverview,
    queryKey: ["getAnalyticsOverview"]
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading analytics overview" />
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const types = [
    "Likes",
    "Comments",
    "Collects",
    "Mirrors",
    "Quotes",
    "Mentions",
    "Follows",
    "Bookmarks"
  ];

  const primaryOptions = types.map((type) => ({
    label: type,
    selected: type === primaryType,
    value: type
  }));

  const secondaryOptions = types.map((type) => ({
    label: type,
    selected: type === secondaryType,
    value: type
  }));

  return (
    <Card>
      <CardHeader title="Profile overview" />
      <div className="m-5 grid grid-cols-2 gap-4">
        <Select
          defaultValue={primaryType}
          onChange={(value) => setPrimaryType(value)}
          options={primaryOptions}
        />
        <Select
          defaultValue={secondaryType}
          onChange={(value) => setSecondaryType(value)}
          options={secondaryOptions}
        />
      </div>
      <div className="divider" />
      <div className="m-5">
        <Line
          data={{
            datasets: [
              {
                backgroundColor:
                  resolvedTheme === "dark"
                    ? colors.gray["900"]
                    : colors.gray["400"],
                borderColor:
                  resolvedTheme === "dark"
                    ? colors.gray["950"]
                    : colors.gray["500"],
                data: data.map(
                  (stat) => stat[primaryType.toLowerCase() as keyof typeof stat]
                ),
                fill: true,
                label: primaryType
              },
              {
                backgroundColor:
                  resolvedTheme === "dark"
                    ? colors.blue["900"]
                    : colors.blue["400"],
                borderColor:
                  resolvedTheme === "dark"
                    ? colors.blue["950"]
                    : colors.blue["500"],
                data: data.map(
                  (stat) =>
                    stat[secondaryType.toLowerCase() as keyof typeof stat]
                ),
                fill: true,
                label: secondaryType
              }
            ],
            labels: data.map((stat) => formatDate(stat.date, "MMM D"))
          }}
          options={{
            plugins: { legend: { display: true } },
            responsive: true
          }}
        />
      </div>
    </Card>
  );
};

export default Overview;
