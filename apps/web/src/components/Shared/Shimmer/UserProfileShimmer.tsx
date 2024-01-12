import type { FC } from 'react';

import cn from '@hey/ui/cn';

interface UserProfileShimmerProps {
  isBig?: boolean;
  showFollow?: boolean;
}

const UserProfileShimmer: FC<UserProfileShimmerProps> = ({
  isBig = false,
  showFollow = false
}) => {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center space-x-3">
        <div
          className={cn(isBig ? 'size-14' : 'size-10', 'shimmer rounded-full')}
        />
        <div className="space-y-3">
          <div className="shimmer h-3 w-28 rounded-lg" />
          <div className="shimmer h-3 w-20 rounded-lg" />
          {isBig ? <div className="shimmer h-3 w-48 rounded-lg" /> : null}
        </div>
      </div>
      {showFollow ? <div className="shimmer h-8 w-10 rounded-lg" /> : null}
    </div>
  );
};

export default UserProfileShimmer;
