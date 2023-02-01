import type { FC } from 'react';

import UserProfileShimmer from './UserProfileShimmer';

const PublicationShimmer: FC = () => {
  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-between">
        <UserProfileShimmer />
        <div className="shimmer h-5 w-5 rounded-lg" />
      </div>
      <div className="ml-[52px] space-y-4">
        <div className="space-y-2">
          <div className="shimmer h-3 w-7/12 rounded-lg" />
          <div className="shimmer h-3 w-1/3 rounded-lg" />
        </div>
        <div className="flex gap-7 pt-3">
          <div className="shimmer h-5 w-5 rounded-lg" />
          <div className="shimmer h-5 w-5 rounded-lg" />
          <div className="shimmer h-5 w-5 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default PublicationShimmer;
