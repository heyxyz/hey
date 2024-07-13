import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import { APP_NAME, HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import formatDate from '@hey/helpers/datetime/formatDate';
import { Card, CardHeader, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import colors from 'tailwindcss/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HeyRevenue: FC = () => {
  const getSignupsStats = async (): Promise<
    { date: string; mint_count: number; signups_count: number }[] | null
  > => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/lens/internal/stats/heyRevenue`,
        { headers: getAuthApiHeaders() }
      );

      return response.data?.result || null;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getSignupsStats,
    queryKey: ['getSignupsStats'],
    refetchInterval: 1000
  });

  if (isLoading) {
    return (
      <Card>
        <Loader
          className="my-10"
          message={`Loading ${APP_NAME} revenue stats...`}
        />
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        title={`Failed to load ${APP_NAME} revenue stats`}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        body="Revenue per day for last 30 days"
        title={`${APP_NAME} Revenue`}
      />
      <div className="m-5">
        <Bar
          data={{
            datasets: [
              {
                backgroundColor: colors['green']['500'],
                data: data.map((signup) => signup.signups_count),
                label: 'Signups'
              },
              {
                backgroundColor: colors['blue']['500'],
                borderRadius: 3,
                data: data.map((signup) => signup.mint_count),
                label: 'Mints'
              }
            ],
            labels: data.map((signup) => formatDate(signup.date, 'MMM D'))
          }}
          options={{
            responsive: true,
            scales: { x: { stacked: true }, y: { stacked: true } }
          }}
        />
      </div>
    </Card>
  );
};

export default HeyRevenue;
