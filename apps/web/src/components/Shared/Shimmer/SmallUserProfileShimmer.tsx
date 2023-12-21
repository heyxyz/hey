import type { FC } from 'react';

import cn from '@hey/ui/cn';

interface SmallUserProfileShimmerProps {
  smallAvatar?: boolean;
}

const SmallUserProfileShimmer: FC<SmallUserProfileShimmerProps> = ({
  smallAvatar = false
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={cn(
          smallAvatar ? 'size-5' : 'size-6',
          'shimmer rounded-full'
        )}
      />
      <div className="shimmer h-3 w-28 rounded-lg" />
      <div className="shimmer h-3 w-20 rounded-lg" />
    </div>
  );
};

export default SmallUserProfileShimmer;
