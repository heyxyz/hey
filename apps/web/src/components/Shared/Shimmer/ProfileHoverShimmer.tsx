import type { FC } from 'react';

const ProfileHoverShimmer: FC = () => {
  return (
    <div className="flex flex-col space-y-2 px-2.5 py-3">
      <div className="flex items-center justify-between space-x-3">
        <div className="shimmer h-10 w-10 rounded-full" />
        <div className="shimmer h-8 w-10 rounded-lg" />
      </div>
      <div className="space-y-3">
        <div className="shimmer h-3 w-24 rounded-lg" />
        <div className="shimmer h-3 w-20 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="shimmer mt-4 h-2 w-full rounded-lg" />
        <div className="shimmer h-2 w-full rounded-lg" />
        <div className="shimmer h-2 w-full rounded-lg" />
        <div className="shimmer h-2 w-full rounded-lg" />
      </div>
      <div className="flex space-x-2">
        <div className="shimmer mt-4 h-2 w-full rounded-lg" />
        <div className="shimmer mt-4 h-2 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default ProfileHoverShimmer;
