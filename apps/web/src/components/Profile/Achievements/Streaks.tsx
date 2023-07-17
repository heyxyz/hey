import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { Card } from '@lenster/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import type { Activity } from 'react-activity-calendar';
import ActivityCalendar from 'react-activity-calendar';

interface StreaksProps {
  profile: Profile;
}

const Streaks: FC<StreaksProps> = ({ profile }) => {
  const fetchStreaks = async () => {
    try {
      const response = await axios(
        `https://achievements.lenster.xyz/streaks/${profile.id}`
      );

      const outputData = Object.entries(response.data.data).map(
        ([date, count]: any) => ({
          date,
          count,
          level: count > 0 ? Math.min(Math.floor(count / 10) + 1, 4) : 0
        })
      );

      return outputData;
    } catch (error) {
      return [];
    }
  };

  const { data, isLoading } = useQuery(['streaks', profile.id], () =>
    fetchStreaks().then((res) => res)
  );

  return (
    <Card className="p-6">
      <ActivityCalendar
        data={data as Activity[]}
        loading={isLoading}
        colorScheme="light"
        blockRadius={50}
        labels={{
          totalCount: `@${formatHandle(
            profile.handle
          )} has {{count}} activities in ${new Date().getFullYear()}`
        }}
        theme={{ light: ['#ede9fe', '#7c3aed'] }}
      />
    </Card>
  );
};

export default Streaks;
