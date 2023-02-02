import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import type { FC } from 'react';

const ProfilePageShimmer: FC = () => {
  return (
    <>
      <div className="shimmer h-52 sm:h-80" />
      <GridLayout className="pt-6">
        <GridItemFour>
          <div className="mb-4 space-y-9 px-5 sm:px-0">
            <div className="relative -mt-24 h-32 w-32 bg-gray-100 sm:-mt-32 sm:h-52 sm:w-52">
              <div className="shimmer h-32 w-32 rounded-xl ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-52 sm:w-52" />
            </div>
            <div className="space-y-3">
              <div className="shimmer h-5 w-1/3 rounded-lg" />
              <div className="shimmer h-3 w-1/4 rounded-lg" />
            </div>
            <div className="space-y-5">
              <div className="flex gap-5 pb-1">
                <div className="space-y-2">
                  <div className="shimmer h-7 w-7 rounded-lg" />
                  <div className="shimmer h-3 w-20 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="shimmer h-7 w-7 rounded-lg" />
                  <div className="shimmer h-3 w-20 rounded-lg" />
                </div>
              </div>
              <div className="shimmer h-[34px] w-28 rounded-lg" />
              <div className="space-y-2">
                <div className="shimmer h-3 w-7/12 rounded-lg" />
                <div className="shimmer h-3 w-1/3 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="shimmer h-4 w-4 rounded-lg" />
                  <div className="shimmer h-3 w-20 rounded-lg" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="shimmer h-4 w-4 rounded-lg" />
                  <div className="shimmer h-3 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </GridItemFour>
        <GridItemEight>
          <div className="mt-3 mb-5 flex gap-3 px-5 sm:mt-0 sm:px-0">
            <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
            <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
            <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
            <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
          </div>
          <PublicationsShimmer />
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ProfilePageShimmer;
