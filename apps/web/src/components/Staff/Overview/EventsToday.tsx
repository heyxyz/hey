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
import type { FC } from "react";
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

interface EventsTodayProps {
  eventsToday: StatsType["eventsToday"];
}

const EventsToday: FC<EventsTodayProps> = ({ eventsToday }) => {
  return (
    <>
      <div className="divider" />
      <CardHeader title="Events Today" />
      <div className="m-5">
        <Line
          data={{
            datasets: [
              {
                backgroundColor: colors.blue[100],
                borderColor: colors.blue[500],
                data: eventsToday.map((event) => event.count),
                fill: true,
                label: "Events"
              }
            ],
            labels: eventsToday.map((event) =>
              formatDate(event.timestamp, "hh:mm")
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

export default EventsToday;
