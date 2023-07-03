import clsx from 'clsx';
import type { FC } from 'react';

interface SmallUserProfileShimmerProps {
  smallAvatar?: boolean;
}

const SmallUserProfileShimmer: FC<SmallUserProfileShimmerProps> = ({
  smallAvatar = false
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={clsx(
          smallAvatar ? 'h-5 w-5' : 'h-6 w-6',
          'shimmer rounded-full'
        )}
      />
      <div className="shimmer h-3 w-28 rounded-lg" />
      <div className="shimmer h-3 w-20 rounded-lg" />
    </div>
  );
};

export default SmallUserProfileShimmer;
