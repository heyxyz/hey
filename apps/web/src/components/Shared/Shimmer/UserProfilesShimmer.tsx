import type { FC } from 'react';

import { Card } from '@hey/ui';

import UserProfileShimmer from './UserProfileShimmer';

interface UserProfilesShimmerProps {
  isBig?: boolean;
  showFollow?: boolean;
}

const UserProfilesShimmer: FC<UserProfilesShimmerProps> = ({
  isBig = false,
  showFollow = false
}) => {
  return (
    <div className="space-y-3">
      <Card className="p-5">
        <UserProfileShimmer isBig={isBig} showFollow={showFollow} />
      </Card>
      <Card className="p-5">
        <UserProfileShimmer isBig={isBig} showFollow={showFollow} />
      </Card>
      <Card className="p-5">
        <UserProfileShimmer isBig={isBig} showFollow={showFollow} />
      </Card>
    </div>
  );
};

export default UserProfilesShimmer;
