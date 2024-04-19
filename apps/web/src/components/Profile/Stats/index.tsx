import { type FC } from 'react';

import ProfileStats from './ProfileStats';
import SuperFollowRevenue from './SuperFollowRevenue';

interface StatsProps {
  profileId: string;
}

const Stats: FC<StatsProps> = ({ profileId }) => {
  return (
    <div className="space-y-5">
      <ProfileStats profileId={profileId} />
      <SuperFollowRevenue profileId={profileId} />
    </div>
  );
};

export default Stats;
