import type { FC } from 'react';

const DecentOpenActionShimmer: FC = () => {
  return (
    <div className="flex items-start space-x-3 px-5 py-4">
      <div>
        <div className="shimmer size-6 rounded-full" />
      </div>
      <div className="w-full space-y-2">
        <div className="item flex justify-between">
          <div>
            <div className="item flex space-x-3 pt-1">
              <div className="shimmer h-3 w-28 rounded-lg" />
              <div className="shimmer h-3 w-20 rounded-lg" />
            </div>
            <div className="shimmer mt-2 h-3 w-12 rounded-lg" />
          </div>
          <div className="shimmer h-10 w-24 rounded-lg bg-red-500" />
        </div>
      </div>
    </div>
  );
};

export default DecentOpenActionShimmer;
