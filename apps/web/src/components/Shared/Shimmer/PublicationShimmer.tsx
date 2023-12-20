import type { FC } from 'react';

import cn from '@hey/ui/cn';

import SmallUserProfileShimmer from './SmallUserProfileShimmer';
import UserProfileShimmer from './UserProfileShimmer';

interface PublicationShimmerProps {
  quoted?: boolean;
  showActions?: boolean;
}

const PublicationShimmer: FC<PublicationShimmerProps> = ({
  quoted = false,
  showActions = true
}) => {
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        {quoted ? <SmallUserProfileShimmer /> : <UserProfileShimmer />}
        <div className="shimmer size-5 rounded-lg" />
      </div>
      <div className={cn(quoted ? '' : 'ml-[52px]', 'space-y-4')}>
        <div className="space-y-2">
          <div className="shimmer h-3 w-7/12 rounded-lg" />
          <div className="shimmer h-3 w-1/3 rounded-lg" />
        </div>
        {showActions ? (
          <div className="flex gap-7 pt-3">
            <div className="shimmer size-5 rounded-lg" />
            <div className="shimmer size-5 rounded-lg" />
            <div className="shimmer size-5 rounded-lg" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PublicationShimmer;
