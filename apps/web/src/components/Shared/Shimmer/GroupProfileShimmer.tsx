import type { FC } from 'react';

const GroupProfileShimmer: FC = () => {
  return (
    <div className="py-1">
      <div className="flex items-center space-x-3">
        <div className="shimmer size-10 rounded-lg" />
        <div className="space-y-3">
          <div className="shimmer h-3 w-28 rounded-lg" />
          <div className="shimmer h-3 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default GroupProfileShimmer;
