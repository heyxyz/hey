import type { Profile } from '@hey/lens';
import { useProStore } from '@store/non-persisted/useProStore';
import { type FC } from 'react';

import ProfileAnalytics from './ProfileAnalytics';
import Streaks from './Streaks';
import StreaksList from './StreaksList';

interface AchievementsProps {
  profile: Profile;
}

const Achievements: FC<AchievementsProps> = ({ profile }) => {
  const isPro = useProStore((state) => state.isPro);

  return (
    <div className="space-y-4">
      <Streaks profile={profile} />
      <StreaksList profile={profile} />
      {isPro && <ProfileAnalytics profile={profile} />}
    </div>
  );
};

export default Achievements;
