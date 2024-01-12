import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import getProfile from '@hey/lib/getProfile';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

import ProfileAnalytics from './ProfileAnalytics';
import Streaks from './Streaks';
import StreaksList from './StreaksList';

interface AchievementsProps {
  profile: Profile;
}

const Achievements: FC<AchievementsProps> = ({ profile }) => {
  const isPro = usePreferencesStore((state) => state.isPro);

  return (
    <div className="space-y-4">
      <Streaks
        handle={getProfile(profile).slugWithPrefix}
        profileId={profile.id}
      />
      <StreaksList profileId={profile.id} />
      {isPro && (
        <ProfileAnalytics
          handle={profile?.handle?.localName}
          profileId={profile.id}
        />
      )}
    </div>
  );
};

export default Achievements;
