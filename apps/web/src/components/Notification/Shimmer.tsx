import type { FC } from 'react';

const NotificationShimmer: FC = () => {
  return (
    <div className="flex justify-between items-start p-5">
      <div className="space-y-4 w-4/5">
        <div className="flex items-center space-x-3">
          <div className="shimmer h-6 w-6 rounded-lg" />
          <div className="shimmer h-8 w-8 rounded-full" />
        </div>
        <div className="ml-9 space-y-2.5">
          <div className="shimmer h-3 w-4/5 rounded-lg" />
          <div className="shimmer h-3 w-3/5 rounded-lg" />
        </div>
      </div>
      <div className="text-gray-400 text-[12px]">
        <div className="shimmer h-3 w-16 rounded-lg" />
      </div>
    </div>
  );
};

export default NotificationShimmer;
