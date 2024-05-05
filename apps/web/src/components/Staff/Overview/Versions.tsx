import type { FC } from 'react';

import { CardHeader } from '@hey/ui';
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

import type { StatsType } from './LeafwatchStats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VersionsProps {
  versions: StatsType['versions'];
}

const Versions: FC<VersionsProps> = ({ versions }) => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="divider" />
      <CardHeader title="Impressions Today" />
      <div className="m-5">
        <Bar
          data={{
            datasets: [
              {
                backgroundColor:
                  resolvedTheme === 'dark'
                    ? colors['zinc']['900']
                    : colors['zinc']['200'],
                borderColor:
                  resolvedTheme === 'dark' ? colors['white'] : colors['black'],
                data: versions.map((version) => version.users),
                label: 'Devices'
              }
            ],
            labels: versions.map((version) => version.version)
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
    </>
  );
};

export default Versions;
