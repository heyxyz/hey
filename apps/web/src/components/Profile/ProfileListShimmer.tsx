import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { Card } from '@hey/ui';

const ProfileListShimmer: FC = () => {
  return (
    <Card className="divide-y dark:divide-gray-700">
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
    </Card>
  );
};

export default ProfileListShimmer;
