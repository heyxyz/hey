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
import type { FeedItem, FeedRequest, Profile, ProfileSearchResult } from 'lens';
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
  const request: FeedRequest = { profileId: profile?.id, limit: 50 };

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
        className="rounded-md p-1 hover:bg-gray-300 hover:bg-opacity-20"
      >
        <span className="flex items-center space-x-1 pl-1 text-sm">
          <img
            onError={({ currentTarget }) => {
              currentTarget.src = getAvatar(profile, false);
            }}
            src={getAvatar(profile)}
            loading="lazy"
            width={20}
            height={20}
            className="h-5 w-5 rounded-full border bg-gray-200 dark:border-gray-700"
            alt={formatHandle(profile?.handle)}
          />
          <span>{seeThroughProfile ? `@${formatHandle(profile?.handle)}` : t`My Feed`}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute right-0 z-[5] mt-1 w-64 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="px-3 pt-2 text-xs">
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
              className="mb-2 mt-1 w-full bg-gray-200 py-2 px-3 text-left text-sm outline-none dark:bg-gray-700"
              onClick={() => setSeeThroughProfile(null)}
            >
              <Trans>Reset filter to your own feed</Trans>
            </button>
          )}
          <div className="mx-2 mb-2">
            {searchUsersLoading || loading ? (
              <div className="space-y-2 py-2 px-4 text-center text-sm font-bold">
                <Spinner size="sm" className="mx-auto" />
                <div>
                  <Trans>Searching users</Trans>
                </div>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <Menu.Item
                    as="div"
                    className={({ active }) =>
                      clsx({ 'dropdown-active': active }, 'cursor-pointer overflow-hidden rounded-lg p-1')
                    }
                    key={profile?.handle}
                    onClick={() => {
                      setSeeThroughProfile(profile);
                      setSearchText('');
                      Analytics.track(MISCELLANEOUS.SELECT_USER_FEED);
                    }}
                  >
                    <UserProfile linkToProfile={false} profile={profile} showUserPreview={false} />
                  </Menu.Item>
                ))}
                {(profiles.length === 0 || error) && (
                  <div className="py-4 text-center">
                    <Trans>No matching users</Trans>
                  </div>
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
