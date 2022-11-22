import UserProfile from '@components/Shared/UserProfile';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { Menu, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import { Leafwatch } from '@lib/leafwatch';
import clsx from 'clsx';
import type { Profile } from 'lens';
import { CustomFiltersTypes, SearchRequestTypes, useSearchProfilesLazyQuery } from 'lens';
import type { ChangeEvent, FC } from 'react';
import React, { Fragment, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useTimelineStore } from 'src/store/timeline';
import { SEARCH } from 'src/tracking';

const SeeThroughLens: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const seeThroughProfile = useTimelineStore((state) => state.seeThroughProfile);
  const setSeeThroughProfile = useTimelineStore((state) => state.setSeeThroughProfile);
  const recommendedProfilesToSeeThrough = useTimelineStore((state) => state.recommendedProfilesToSeeThrough);
  const [searchText, setSearchText] = useState('');

  const profile = seeThroughProfile ?? currentProfile;

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] = useSearchProfilesLazyQuery();

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

  // @ts-ignore
  const searchResults = searchUsersData?.search?.items ?? [];
  const recommendedProfiles = recommendedProfilesToSeeThrough ?? [];

  const profiles =
    searchResults.length && searchText.length ? searchResults : recommendedProfiles.slice(0, 5);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20">
        <span className="flex space-x-1 items-center text-sm pl-1">
          <img
            src={getAvatar(profile)}
            loading="lazy"
            width={20}
            height={20}
            className="bg-gray-200 w-5 h-5 rounded-full border dark:border-gray-700/80"
            alt={profile?.handle}
          />
          <span>{seeThroughProfile ? `@${profile?.handle}` : 'My Feed'}</span>
          <ChevronDownIcon className="w-5 h-5" />
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className="absolute w-64 right-0 z-[5] mt-1 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
        >
          <div className="text-xs pt-2 px-3">👀 See the feed through...</div>
          <div className="p-2">
            <Input
              type="text"
              className="py-2 px-3 text-sm"
              placeholder="Search"
              value={searchText}
              autoFocus
              autoComplete="off"
              iconRight={
                <XIcon
                  className={clsx('cursor-pointer', searchText ? 'visible' : 'invisible')}
                  onClick={() => {
                    setSearchText('');
                    Leafwatch.track(SEARCH.CLEAR);
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
            {searchUsersLoading ? (
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
                    }}
                  >
                    <UserProfile showUserPreview={false} linkToProfile={false} profile={profile} />
                  </Menu.Item>
                ))}
                {profiles.length === 0 && <div className="py-4 text-center">No matching users</div>}
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SeeThroughLens;
