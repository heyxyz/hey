import MenuTransition from '@components/Shared/MenuTransition';
import UserProfile from '@components/Shared/UserProfile';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { Menu } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FeedItem, Profile, ProfileSearchResult } from 'lens';
import {
  CustomFiltersTypes,
  SearchRequestTypes,
  useSearchProfilesLazyQuery,
  useTimelineLazyQuery
} from 'lens';
import type { ChangeEvent, FC } from 'react';
import { Fragment, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useTimelineStore } from 'src/store/timeline';
import { MISCELLANEOUS, SEARCH } from 'src/tracking';

const SeeThroughLens: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const seeThroughProfile = useTimelineStore((state) => state.seeThroughProfile);
  const setSeeThroughProfile = useTimelineStore((state) => state.setSeeThroughProfile);

  const [recommendedProfilesToSeeThrough, setRecommendedProfilesToSeeThrough] = useState<Profile[]>([]);
  const [searchText, setSearchText] = useState('');

  const setRecommendedProfiles = (feedItems: FeedItem[]) => {
    let uniqueProfileIds: string[] = [];
    let profiles: Profile[] = [];
    for (const feedItem of feedItems) {
      const profileId = feedItem.root?.profile?.id;
      if (
        !uniqueProfileIds.includes(profileId) &&
        profileId !== seeThroughProfile?.id &&
        profileId !== currentProfile?.id
      ) {
        profiles.push(feedItem.root?.profile as Profile);
        uniqueProfileIds.push(profileId);
      }
    }
    setRecommendedProfilesToSeeThrough(profiles?.slice(0, 5));
  };

  const profile = seeThroughProfile ?? currentProfile;
  const request = { profileId: profile?.id, limit: 50 };

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] = useSearchProfilesLazyQuery();

  const [fetchRecommendedProfiles, { loading, error }] = useTimelineLazyQuery({
    variables: { request, profileId: profile?.id },
    onCompleted: (data) => {
      const feedItems = data?.feed?.items as FeedItem[];
      setRecommendedProfiles(feedItems);
    }
  });

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    searchUsers({
      variables: {
        request: {
          type: SearchRequestTypes.Profile,
          query: keyword,
          customFilters: [CustomFiltersTypes.Gardeners],
          limit: 5
        }
      }
    });
  };

  const search = searchUsersData?.search as ProfileSearchResult;
  const searchProfiles = search?.items ?? [];
  const recommendedProfiles = recommendedProfilesToSeeThrough ?? [];

  const profiles =
    searchProfiles.length && searchText.length ? searchProfiles : recommendedProfiles.slice(0, 5);

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        onClick={() => fetchRecommendedProfiles()}
        className="rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20"
      >
        <span className="flex space-x-1 items-center text-sm pl-1">
          <img
            src={getAvatar(profile)}
            loading="lazy"
            width={20}
            height={20}
            className="bg-gray-200 w-5 h-5 rounded-full border dark:border-gray-700"
            alt={formatHandle(profile?.handle)}
          />
          <span>{seeThroughProfile ? `@${formatHandle(profile?.handle)}` : t`My Feed`}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute w-64 right-0 z-[5] mt-1 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700"
        >
          <div className="text-xs pt-2 px-3">
            <Trans>👀 See the feed through...</Trans>
          </div>
          <div className="p-2">
            <Input
              type="text"
              className="py-2 px-3 text-sm"
              placeholder={t`Search`}
              value={searchText}
              autoFocus
              autoComplete="off"
              iconRight={
                <XIcon
                  className={clsx('cursor-pointer', searchText ? 'visible' : 'invisible')}
                  onClick={() => {
                    setSearchText('');
                    Analytics.track(SEARCH.CLEAR);
                  }}
                />
              }
              onChange={handleSearch}
            />
          </div>
          {seeThroughProfile && (
            <button
              className="py-2 px-3 mb-2 text-left outline-none w-full mt-1 bg-gray-200 text-sm dark:bg-gray-700"
              onClick={() => setSeeThroughProfile(null)}
            >
              Reset filter to your own feed
            </button>
          )}
          <div className="mx-2 mb-2">
            {searchUsersLoading || loading ? (
              <div className="py-2 px-4 space-y-2 text-sm font-bold text-center">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <Menu.Item
                    as="div"
                    className={({ active }) =>
                      clsx({ 'dropdown-active': active }, 'rounded-lg overflow-hidden cursor-pointer p-1')
                    }
                    key={profile?.handle}
                    onClick={() => {
                      setSeeThroughProfile(profile);
                      setSearchText('');
                      Analytics.track(MISCELLANEOUS.SELECT_USER_FEED);
                    }}
                  >
                    <UserProfile showUserPreview={false} linkToProfile={false} profile={profile} />
                  </Menu.Item>
                ))}
                {(profiles.length === 0 || error) && (
                  <div className="py-4 text-center">No matching users</div>
                )}
              </>
            )}
          </div>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default SeeThroughLens;
