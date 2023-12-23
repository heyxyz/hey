import type {
  FeedItem,
  FeedRequest,
  PaginatedProfileResult,
  Profile
} from '@hey/lens';
import type { ChangeEvent, FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import UserProfile from '@components/Shared/UserProfile';
import { Menu } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { HOME } from '@hey/data/tracking';
import {
  CustomFiltersType,
  LimitType,
  useFeedLazyQuery,
  useSearchProfilesLazyQuery
} from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image, Input, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

const SeeThroughLens: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const setSeeThroughProfile = useTimelineStore(
    (state) => state.setSeeThroughProfile
  );

  const [recommendedProfilesToSeeThrough, setRecommendedProfilesToSeeThrough] =
    useState<Profile[]>([]);
  const [searchText, setSearchText] = useState('');

  const setRecommendedProfiles = (feedItems: FeedItem[]) => {
    const uniqueProfileIds: string[] = [];
    const profiles: Profile[] = [];
    for (const feedItem of feedItems) {
      const profileId = feedItem.root.by.id;
      if (
        !uniqueProfileIds.includes(profileId) &&
        profileId !== seeThroughProfile?.id &&
        profileId !== currentProfile?.id
      ) {
        profiles.push(feedItem.root.by as Profile);
        uniqueProfileIds.push(profileId);
      }
    }
    setRecommendedProfilesToSeeThrough(profiles?.slice(0, 5));
  };

  const profile = seeThroughProfile || currentProfile;
  const request: FeedRequest = { where: { for: profile?.id } };

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useSearchProfilesLazyQuery();

  const [fetchRecommendedProfiles, { error, loading }] = useFeedLazyQuery({
    onCompleted: ({ feed }) => {
      const feedItems = feed?.items as FeedItem[];
      setRecommendedProfiles(feedItems);
    },
    variables: { request }
  });

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    searchUsers({
      variables: {
        request: {
          limit: LimitType.TwentyFive,
          query: keyword,
          where: {
            customFilters: [CustomFiltersType.Gardeners]
          }
        }
      }
    });
  };

  const search = searchUsersData?.searchProfiles as PaginatedProfileResult;
  const searchProfiles = search?.items || [];
  const recommendedProfiles = recommendedProfilesToSeeThrough || [];

  const profiles =
    searchProfiles.length && searchText.length
      ? searchProfiles
      : recommendedProfiles.slice(0, 5);

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>
        <button
          className="outline-brand-500 flex items-center space-x-1 rounded-md p-1 text-sm hover:bg-gray-300/20"
          onClick={() => fetchRecommendedProfiles()}
          type="button"
        >
          <Image
            alt={profile?.id}
            className="size-5 rounded-full border bg-gray-200 dark:border-gray-700"
            height={20}
            loading="lazy"
            src={getAvatar(profile)}
            width={20}
          />
          <span>
            {seeThroughProfile ? getProfile(profile).slugWithPrefix : 'My Feed'}
          </span>
          <ChevronDownIcon className="size-4" />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          className="absolute right-0 z-[5] mt-1 w-64 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <div className="px-3 pt-2 text-xs">👀 See the feed through...</div>
          <div className="p-2">
            <Input
              autoComplete="off"
              className="px-3 py-2 text-sm"
              iconRight={
                <XMarkIcon
                  className={cn(
                    'cursor-pointer',
                    searchText ? 'visible' : 'invisible'
                  )}
                  onClick={() => setSearchText('')}
                />
              }
              onChange={handleSearch}
              placeholder="Search"
              type="text"
              value={searchText}
            />
          </div>
          {seeThroughProfile && (
            <button
              className="mb-2 mt-1 w-full bg-gray-200 px-3 py-2 text-left text-sm outline-none dark:bg-gray-700"
              onClick={() => setSeeThroughProfile(null)}
              type="reset"
            >
              Reset filter to your own feed
            </button>
          )}
          <div className="mx-2 mb-2">
            {searchUsersLoading || loading ? (
              <div className="space-y-2 px-4 py-2 text-center text-sm font-bold">
                <Spinner className="mx-auto" size="sm" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <Menu.Item
                    animate={{ opacity: 1 }}
                    as={motion.div}
                    className={({ active }) =>
                      cn(
                        { 'dropdown-active': active },
                        'cursor-pointer overflow-hidden rounded-lg p-1'
                      )
                    }
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key={profile.id}
                    onClick={() => {
                      setSeeThroughProfile(profile);
                      setSearchText('');
                      Leafwatch.track(HOME.SELECT_USER_FEED, {
                        see_through_profile: profile.id
                      });
                    }}
                  >
                    <UserProfile
                      linkToProfile={false}
                      profile={profile}
                      showUserPreview={false}
                    />
                  </Menu.Item>
                ))}
                {profiles.length === 0 || error ? (
                  <div className="py-4 text-center">No matching users</div>
                ) : null}
              </>
            )}
          </div>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default SeeThroughLens;
