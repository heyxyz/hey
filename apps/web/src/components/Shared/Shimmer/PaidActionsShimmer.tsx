import type { FC } from 'react';

import { Card } from '@hey/ui';

import PublicationShimmer from './PublicationShimmer';
import SmallUserProfileShimmer from './SmallUserProfileShimmer';
import UserProfileShimmer from './UserProfileShimmer';

const PaidActionsShimmer: FC = () => {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center space-x-2 px-6 py-4">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallUserProfileShimmer smallAvatar />
        </div>
        <div className="divider" />
        <PublicationShimmer />
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-6">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallUserProfileShimmer smallAvatar />
        </div>
        <div className="divider" />
        <div className="p-5">
          <UserProfileShimmer isBig showFollowUnfollowButton />
        </div>
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-6">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallUserProfileShimmer smallAvatar />
        </div>
        <PublicationShimmer />
      </Card>
    </div>
  );
};

export default PaidActionsShimmer;
