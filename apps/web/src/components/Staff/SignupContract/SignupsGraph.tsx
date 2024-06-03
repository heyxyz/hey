import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
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
import { useTheme } from 'next-themes';
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

const SignupsGraph: FC = () => {
  const { resolvedTheme } = useTheme();

  const getSignupsStats = async (): Promise<
    { date: string; mint_count: number; signups_count: number }[] | null
  > => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/lens/internal/stats/signups`
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
        <Loader className="my-10" message="Loading signup stats..." />
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load signup stats" />;
  }

  return (
    <>
      <Card>
        <CardHeader body="Signups per day for last 30 days" title="Signups" />
        <div className="m-5">
          <Bar
            data={{
              datasets: [
                {
                  backgroundColor:
                    resolvedTheme === 'dark'
                      ? colors['zinc']['900']
                      : colors['zinc']['400'],
                  data: data.map((signup) => signup.signups_count),
                  label: 'Signups'
                }
              ],
              labels: data.map((signup) => formatDate(signup.date, 'MMM D'))
            }}
            options={{
              plugins: { legend: { display: false } },
              responsive: true
            }}
          />
        </div>
      </Card>
      <Card>
        <CardHeader
          body="NFT mints per day for last 30 days"
          title="NFT Mints"
        />
        <div className="m-5">
          <Bar
            data={{
              datasets: [
                {
                  backgroundColor:
                    resolvedTheme === 'dark'
                      ? colors['zinc']['900']
                      : colors['zinc']['400'],
                  data: data.map((signup) => signup.mint_count),
                  label: 'Mints'
                }
              ],
              labels: data.map((signup) => formatDate(signup.date, 'MMM D'))
            }}
            options={{
              plugins: { legend: { display: false } },
              responsive: true
            }}
          />
        </div>
      </Card>
    </>
  );
};

export default SignupsGraph;
