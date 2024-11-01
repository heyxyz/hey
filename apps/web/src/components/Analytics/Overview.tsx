import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import formatDate from "@hey/helpers/datetime/formatDate";
import { Card, CardHeader, Select } from "@hey/ui";
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
import { type FC, useState } from "react";
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

const GET_OVERVIEW_QUERY_KEY = "getOverview";

const Overview: FC = () => {
  const [primaryType, setPrimaryType] = useState<string>("Likes");
  const [secondaryType, setSecondaryType] = useState<string>("None");

  const getOverview = async (): Promise<
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
      const { data } = await axios.get(`${HEY_API_URL}/analytics/overview`, {
        headers: getAuthApiHeaders()
      });

      return data.result;
    } catch {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryFn: getOverview,
    queryKey: [GET_OVERVIEW_QUERY_KEY]
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading overview" />
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const types = [
    "None",
    "Likes",
    "Comments",
    "Collects",
    "Mirrors",
    "Quotes",
    "Mentions",
    "Follows",
    "Bookmarks"
  ];

  const primaryOptions = types
    .filter((type) => type !== "None")
    .map((type) => ({
      label: type,
      selected: type === primaryType,
      value: type
    }));

  const secondaryOptions = types
    .filter((type) => type !== primaryType)
    .map((type) => ({
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
        <Bar
          data={{
            datasets: [
              {
                backgroundColor: colors.green[500],
                borderRadius: secondaryType === "None" ? 5 : 0,
                data: data.map(
                  (stat) => stat[primaryType.toLowerCase() as keyof typeof stat]
                ),
                label: primaryType
              },
              {
                backgroundColor: colors.blue[500],
                borderRadius: 5,
                data: data.map(
                  (stat) =>
                    stat[secondaryType.toLowerCase() as keyof typeof stat]
                ),
                label: secondaryType
              }
            ],
            labels: data.map((stat) => formatDate(stat.date, "MMM D"))
          }}
          options={{
            scales: { x: { stacked: true }, y: { stacked: true } },
            responsive: true
          }}
        />
      </div>
    </Card>
  );
};

export default Overview;
