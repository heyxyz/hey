import type { FC } from 'react';

import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';

interface ProfilePageShimmerProps {
  profileList?: boolean;
}

const ProfilePageShimmer: FC<ProfilePageShimmerProps> = ({
  profileList = false
}) => {
  return (
    <>
      <div className="shimmer h-52 sm:h-[350px]" />
      <GridLayout>
        <GridItemFour>
          <div className="mb-4 space-y-9 px-5 sm:px-0">
            <div className="relative -mt-24 size-32 bg-gray-100 sm:-mt-32 sm:size-52">
              <div className="shimmer size-32 rounded-xl ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black" />
            </div>
            <div className="space-y-3">
              <div className="shimmer h-5 w-1/3 rounded-lg" />
              <div className="shimmer h-3 w-1/4 rounded-lg" />
            </div>
            <div className="space-y-5">
              <div className="flex gap-5 pb-1">
                <div className="space-y-2">
                  <div className="shimmer size-7 rounded-lg" />
                  <div className="shimmer h-3 w-20 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="shimmer size-7 rounded-lg" />
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
                  <div className="shimmer size-4 rounded-lg" />
                  <div className="shimmer h-3 w-20 rounded-lg" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="shimmer size-4 rounded-lg" />
                  <div className="shimmer h-3 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </GridItemFour>
        <GridItemEight>
          {profileList ? (
            <ProfileListShimmer />
          ) : (
            <>
              <div className="mb-5 mt-3 flex gap-3 px-5 sm:mt-0 sm:px-0">
                <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
                <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
                <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
                <div className="shimmer h-8 w-14 rounded-lg sm:w-28" />
              </div>
              <PublicationsShimmer />
            </>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ProfilePageShimmer;
