import type { FC } from 'react';

const GroupProfileShimmer: FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="shimmer size-11 rounded-lg" />
      <div className="space-y-4 py-1">
        <div className="shimmer h-3 w-28 rounded-lg" />
        <div className="shimmer h-3 w-20 rounded-lg" />
      </div>
    </div>
  );
};

export default GroupProfileShimmer;
