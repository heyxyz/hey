import type { Profile } from '@lenster/lens';
import type { FC } from 'react';

import Streaks from './Streaks';
import StreaksList from './StreaksList';

interface AchievementsProps {
  profile: Profile;
}

const Achievements: FC<AchievementsProps> = ({ profile }) => {
  return (
    <div className="space-y-4">
      <Streaks profile={profile} />
      <StreaksList profile={profile} />
    </div>
  );
};

export default Achievements;
