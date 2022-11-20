import { Card } from '@components/UI/Card';
import type { FC } from 'react';

import UserProfileShimmer from './UserProfileShimmer';

interface Props {
  showFollow?: boolean;
  isBig?: boolean;
}

const UserProfilesShimmer: FC<Props> = ({ showFollow = false, isBig = false }) => {
  return (
    <div className="space-y-3">
      <Card className="p-5">
        <UserProfileShimmer showFollow={showFollow} isBig={isBig} />
      </Card>
      <Card className="p-5">
        <UserProfileShimmer showFollow={showFollow} isBig={isBig} />
      </Card>
      <Card className="p-5">
        <UserProfileShimmer showFollow={showFollow} isBig={isBig} />
      </Card>
    </div>
  );
};

export default UserProfilesShimmer;
