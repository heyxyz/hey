import type { FC } from 'react';

const DecentOpenActionShimmer: FC = () => {
  return (
    <div className="flex items-start space-x-3 border-t px-5 py-4 dark:border-gray-700">
      <div>
        <div className="shimmer size-6 rounded-full" />
      </div>
      <div className="w-full space-y-2">
        <div className="item flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div>
            <div className="item flex space-x-3 pt-1">
              <div className="shimmer h-3 w-28 rounded-lg" />
              <div className="shimmer hidden h-3 w-20 rounded-lg sm:block" />
            </div>
            <div className="shimmer mt-2 h-3 w-12 rounded-lg" />
          </div>
          <div className="shimmer mt-2 h-10 w-full rounded-full bg-red-500 sm:mt-0 sm:w-24" />
        </div>
      </div>
    </div>
  );
};

export default DecentOpenActionShimmer;
