import type { Profile } from '@hey/lens';
import type { Activity } from 'react-activity-calendar';

import { HEY_API_URL } from '@hey/data/constants';
import getProfile from '@hey/lib/getProfile';
import { Card } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import ActivityCalendar from 'react-activity-calendar';

interface StreaksProps {
  profile: Profile;
}

const Streaks: FC<StreaksProps> = ({ profile }) => {
  const fetchStreaks = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/stats/streaksCalendar`, {
        params: { id: profile.id }
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
    queryKey: ['fetchStreaks', profile.id]
  });

  return (
    <Card className="p-6">
      <ActivityCalendar
        blockRadius={50}
        colorScheme="light"
        data={data as Activity[]}
        labels={{
          totalCount: `${
            getProfile(profile).slugWithPrefix
          } has {{count}} activities in ${new Date().getFullYear()}`
        }}
        loading={isLoading}
        theme={{ light: ['#FED5D9', '#FB3A5D'] }}
      />
    </Card>
  );
};

export default Streaks;
