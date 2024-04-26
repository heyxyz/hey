import type { Profile, ProfileSearchRequest } from '@hey/lens';
import type { ChangeEvent, FC, MutableRefObject } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { Leafwatch } from '@helpers/leafwatch';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource, SEARCH } from '@hey/data/tracking';
import getProfile from '@hey/helpers/getProfile';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesLazyQuery
} from '@hey/lens';
import { Card, Input } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useClickAway, useDebounce } from '@uidotdev/usehooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearchStore } from 'src/store/persisted/useSearchStore';

import RecentProfiles from './RecentProfiles';

interface SearchProps {
  placeholder?: string;
}

const Search: FC<SearchProps> = ({ placeholder = 'Search…' }) => {
  const { pathname, push, query } = useRouter();
  const { addProfile: addToRecentProfiles } = useSearchStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  const reset = () => {
    setShowDropdown(false);
    setProfiles([]);
    setSearchText('');
  };

  const dropdownRef = useClickAway(() => {
    reset();
  }) as MutableRefObject<HTMLDivElement>;

  const [searchUsers, { loading: searchUsersLoading }] =
    useSearchProfilesLazyQuery();

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    Leafwatch.track(SEARCH.SEARCH, { query: searchText });
    if (pathname === '/search') {
      push(`/search?q=${encodeURIComponent(searchText)}&type=${query.type}`);
    } else {
      push(`/search?q=${encodeURIComponent(searchText)}&type=profiles`);
    }
    reset();
  };

  useEffect(() => {
    if (pathname !== '/search' && showDropdown && debouncedSearchText) {
      // Variables
      const request: ProfileSearchRequest = {
        limit: LimitType.Ten,
        query: debouncedSearchText,
        where: { customFilters: [CustomFiltersType.Gardeners] }
      };

      searchUsers({ variables: { request } }).then((res) => {
        if (res.data?.searchProfiles?.items) {
          setProfiles(res.data.searchProfiles.items as Profile[]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  return (
    <div className="w-full">
      <form onSubmit={handleKeyDown}>
        <Input
          className="px-3 py-2 text-sm"
          iconLeft={<MagnifyingGlassIcon />}
          iconRight={
            <XMarkIcon
              className={cn(
                'cursor-pointer',
                searchText ? 'visible' : 'invisible'
              )}
              onClick={() => reset()}
            />
          }
          onChange={handleSearch}
          onClick={() => setShowDropdown(true)}
          placeholder={placeholder}
          type="text"
          value={searchText}
        />
      </form>
      {pathname !== '/search' && showDropdown ? (
        <div
          className="absolute mt-2 flex w-[94%] max-w-md flex-col"
          ref={dropdownRef}
        >
          <Card className="z-[2] max-h-[80vh] overflow-y-auto py-2">
            {!debouncedSearchText && <RecentProfiles onProfileClick={reset} />}
            {searchUsersLoading ? (
              <Loader className="my-3" message="Searching users" small />
            ) : (
              <>
                {profiles.map((profile) => (
                  <div
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    key={profile.id}
                    onClick={() => {
                      addToRecentProfiles(profile.id);
                      push(getProfile(profile).link);
                      reset();
                    }}
                  >
                    <UserProfile
                      hideFollowButton
                      hideUnfollowButton
                      linkToProfile={false}
                      profile={profile}
                      showUserPreview={false}
                      source={ProfileLinkSource.Search}
                    />
                  </div>
                ))}
                {profiles.length === 0 ? (
                  <div className="px-4 py-2">
                    Try searching for people or keywords
                  </div>
                ) : null}
              </>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
