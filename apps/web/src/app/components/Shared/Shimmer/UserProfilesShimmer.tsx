'use client';
import type { FC } from 'react';
import { Card } from 'ui';

import UserProfileShimmer from './UserProfileShimmer';

interface UserProfilesShimmerProps {
  showFollow?: boolean;
  isBig?: boolean;
}

const UserProfilesShimmer: FC<UserProfilesShimmerProps> = ({
  showFollow = false,
  isBig = false
}) => {
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
