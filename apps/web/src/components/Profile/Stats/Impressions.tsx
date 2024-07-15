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

interface ImpressionsProps {
  profileId: string;
}

const Impressions: FC<ImpressionsProps> = ({ profileId }) => {
  const { resolvedTheme } = useTheme();

  const getImpressionsStats = async (): Promise<
    { count: number; date: string }[] | null
  > => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/stats/profile/impressions`,
        { params: { id: profileId } }
      );

      return response.data?.impressions || null;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getImpressionsStats,
    queryKey: ['getImpressionsStats', profileId],
    refetchInterval: 10000
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading impression stats..." />
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load impression stats" />
    );
  }

  return (
    <Card>
      <CardHeader title="Impressions Stats" />
      <div className="m-5">
        <Bar
          data={{
            datasets: [
              {
                backgroundColor:
                  resolvedTheme === 'dark'
                    ? colors['zinc']['900']
                    : colors['zinc']['400'],
                borderRadius: 3,
                data: data.map((impression) => impression.count),
                label: 'Impressions'
              }
            ],
            labels: data.map((impression) =>
              formatDate(impression.date, 'MMM D')
            )
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
