import type { FC } from 'react';
import type { Activity } from 'react-activity-calendar';

import { BRAND_COLOR, HEY_API_URL } from '@hey/data/constants';
import { Card } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ActivityCalendar from 'react-activity-calendar';

interface StreaksProps {
  handle: string;
  profileId: string;
}

const Streaks: FC<StreaksProps> = ({ handle, profileId }) => {
  const fetchStreaks = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/stats/streaksCalendar`, {
        params: { id: profileId }
      });

      const outputData = Object.entries(response.data.data).map(
        ([date, count]: any) => ({
          count,
          date,
          level: count > 0 ? Math.min(Math.floor(count / 10) + 1, 4) : 0
        })
      );

      return outputData;
    } catch {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryFn: fetchStreaks,
    queryKey: ['fetchStreaks', profileId]
  });

  return (
    <Card className="p-6">
      <ActivityCalendar
        blockMargin={3}
        blockRadius={50}
        blockSize={11.5}
        colorScheme="light"
        data={data as Activity[]}
        labels={{
          totalCount: `${handle} has {{count}} activities in ${new Date().getFullYear()}`
        }}
        loading={isLoading}
        theme={{ light: ['#FED5D9', BRAND_COLOR] }}
      />
    </Card>
  );
};

export default Streaks;
