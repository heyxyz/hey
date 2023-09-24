import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import type { FC } from 'react';

const ChannelPageShimmer: FC = () => {
  return (
    <GridLayout className="pt-6">
      <GridItemFour>
        <div className="mb-4 space-y-9 px-5 sm:px-0">
          <div className="relative h-32 w-32 bg-gray-100 sm:h-52 sm:w-52">
            <div className="shimmer h-32 w-32 rounded-xl ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-52 sm:w-52" />
          </div>
          <div className="space-y-3">
            <div className="shimmer h-5 w-1/3 rounded-lg" />
            <div className="shimmer h-3 w-1/4 rounded-lg" />
          </div>
          <div className="space-y-5">
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
              <div className="flex items-center space-x-2">
                <div className="shimmer h-4 w-4 rounded-lg" />
                <div className="shimmer h-3 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </GridItemFour>
      <GridItemEight>
        <PublicationsShimmer />
      </GridItemEight>
    </GridLayout>
  );
};

export default ChannelPageShimmer;
