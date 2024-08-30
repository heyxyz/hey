import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';

const ProfileListShimmer: FC = () => {
  return (
    <Card className="divide-y dark:divide-gray-700">
      <div className="flex items-center space-x-3 px-6 py-7">
        <ArrowLeftIcon className="size-5" />
        <div className="shimmer h-4 w-1/5 rounded-full" />
      </div>
      <UserProfileShimmer className="p-6" showFollowUnfollowButton />
      <UserProfileShimmer className="p-6" showFollowUnfollowButton />
      <UserProfileShimmer className="p-6" showFollowUnfollowButton />
      <UserProfileShimmer className="p-6" showFollowUnfollowButton />
      <UserProfileShimmer className="p-6" showFollowUnfollowButton />
    </Card>
  );
};

export default ProfileListShimmer;
