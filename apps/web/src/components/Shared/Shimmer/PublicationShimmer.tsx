import clsx from 'clsx';
import type { FC } from 'react';

import SmallUserProfileShimmer from './SmallUserProfileShimmer';
import UserProfileShimmer from './UserProfileShimmer';

interface PublicationShimmerProps {
  showActions?: boolean;
  quoted?: boolean;
}

const PublicationShimmer: FC<PublicationShimmerProps> = ({
  showActions = true,
  quoted = false
}) => {
  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-between">
        {quoted ? <SmallUserProfileShimmer /> : <UserProfileShimmer />}
        <div className="shimmer h-5 w-5 rounded-lg" />
      </div>
      <div className={clsx(quoted ? '' : 'ml-[52px]', 'space-y-4')}>
        <div className="space-y-2">
          <div className="shimmer h-3 w-7/12 rounded-lg" />
          <div className="shimmer h-3 w-1/3 rounded-lg" />
        </div>
        {showActions && (
          <div className="flex gap-7 pt-3">
            <div className="shimmer h-5 w-5 rounded-lg" />
            <div className="shimmer h-5 w-5 rounded-lg" />
            <div className="shimmer h-5 w-5 rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationShimmer;
