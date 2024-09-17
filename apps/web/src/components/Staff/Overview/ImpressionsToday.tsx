import type { FC } from "react";

import formatDate from "@hey/helpers/datetime/formatDate";
import { CardHeader } from "@hey/ui";
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
import { Line } from "react-chartjs-2";
import colors from "tailwindcss/colors";

import type { StatsType } from "./LeafwatchStats";

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

interface ImpressionsTodayProps {
  impressionsToday: StatsType["impressionsToday"];
}

const ImpressionsToday: FC<ImpressionsTodayProps> = ({ impressionsToday }) => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="divider" />
      <CardHeader title="Impressions Today" />
      <div className="m-5">
        <Line
          data={{
            datasets: [
              {
                backgroundColor:
                  resolvedTheme === "dark"
                    ? colors["zinc"]["900"]
                    : colors["zinc"]["400"],
                borderColor:
                  resolvedTheme === "dark" ? colors["white"] : colors["black"],
                data: impressionsToday.map((impression) => impression.count),
                fill: true,
                label: "Impressions"
              }
            ],
            labels: impressionsToday.map((impression) =>
              formatDate(impression.timestamp, "hh:mm")
            )
          }}
          options={{
            plugins: { legend: { display: false } },
            responsive: true
          }}
        />
      </div>
    </>
  );
};

export default ImpressionsToday;
