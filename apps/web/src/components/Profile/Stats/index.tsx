import { type FC } from 'react';

import SuperFollowRevenue from './SuperFollowRevenue';

interface StatsProps {
  profileId: string;
}

const Stats: FC<StatsProps> = ({ profileId }) => {
  return <SuperFollowRevenue profileId={profileId} />;
};

export default Stats;
