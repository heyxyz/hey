import type { FC } from 'react';

import { BRAND_COLOR } from '@hey/data/constants';
import formatDate from '@hey/lib/datetime/formatDate';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import type { StatsType } from './LeafwatchStats';

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
  eventsToday: StatsType['eventsToday'];
}

const EventsToday: FC<EventsTodayProps> = ({ eventsToday }) => {
  return (
    <div>
      <div>
        <div className="divider" />
        <div className="p-5 text-lg font-bold">Events Today</div>
        <div className="divider" />
        <div className="p-5">
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: '#fff0f2',
                  borderColor: BRAND_COLOR,
                  data: eventsToday.map((event) => event.count),
                  fill: true,
                  label: 'Events'
                }
              ],
              labels: eventsToday.map((event) =>
                formatDate(event.timestamp, 'hh:mm')
              )
            }}
            options={{
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              responsive: true
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsToday;
