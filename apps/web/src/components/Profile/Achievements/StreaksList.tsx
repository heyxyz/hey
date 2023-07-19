import { ACHIEVEMENTS_WORKER_URL } from '@lenster/data/constants';
import type { Profile } from '@lenster/lens';
import { Card } from '@lenster/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';

interface StreaksListProps {
  profile: Profile;
}

const StreaksList: FC<StreaksListProps> = ({ profile }) => {
  const fetchStreaksList = async () => {
    try {
      const response = await axios(
        `${ACHIEVEMENTS_WORKER_URL}/streaks/${profile.id}/2023-07-19`
      );

      return response.data.data;
    } catch (error) {
      return [];
    }
  };

  const { data, isLoading } = useQuery(['streaksList', profile.id], () =>
    fetchStreaksList().then((res) => res)
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div>Loading</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {data.map((streak: { id: string; event: string; date: string }) => (
        <div key={streak.id}>
          <div>{streak.event}</div>
        </div>
      ))}
    </Card>
  );
};

export default StreaksList;
