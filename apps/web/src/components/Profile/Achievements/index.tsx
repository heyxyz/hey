import { FeatureFlag } from '@hey/data/feature-flags';
import type { Profile } from '@hey/lens';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { type FC } from 'react';

import ProfileAnalytics from './ProfileAnalytics';
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
      {isFeatureEnabled(FeatureFlag.Pro) && (
        <ProfileAnalytics profile={profile} />
      )}
    </div>
  );
};

export default Achievements;
