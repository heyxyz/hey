import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Profile, ProfileSearchResult } from 'lens';
import { CustomFiltersTypes, SearchRequestTypes, useSearchProfilesLazyQuery } from 'lens';
import formatHandle from 'lib/formatHandle';
import { useRouter } from 'next/router';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { Input, Spinner } from 'ui';

import UserProfile from '../UserProfile';

interface SearchProps {
  hideDropdown?: boolean;
  onProfileSelected?: (profile: Profile) => void;
  placeholder?: string;
  modalWidthClassName?: string;
}

const Search: FC<SearchProps> = ({
  hideDropdown = false,
  onProfileSelected,
  placeholder = t`Search…`,
  modalWidthClassName = 'max-w-md'
}) => {
  const { push, pathname, query } = useRouter();
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setSearchText(''));

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] = useSearchProfilesLazyQuery();

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    if (pathname !== '/search' && !hideDropdown) {
      searchUsers({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query: keyword,
            customFilters: [CustomFiltersTypes.Gardeners],
            limit: 8
          }
        }
      });
    }
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (pathname === '/search') {
      push(`/search?q=${encodeURIComponent(searchText)}&type=${query.type}`);
    } else {
      push(`/search?q=${encodeURIComponent(searchText)}&type=profiles`);
    }
    setSearchText('');
  };

  const searchResult = searchUsersData?.search as ProfileSearchResult;
  const isProfileSearchResult = searchResult && searchResult.hasOwnProperty('items');
  const profiles = isProfileSearchResult ? searchResult.items : [];

  return (
    <div aria-hidden="true" className="w-full" data-testid="global-search">
      <form onSubmit={handleKeyDown}>
        <Input
          type="text"
          className="px-3 py-2 text-sm"
          placeholder={placeholder}
          value={searchText}
          iconLeft={<SearchIcon />}
          autoComplete="off"
          iconRight={
            <XIcon
              className={clsx('cursor-pointer', searchText ? 'visible' : 'invisible')}
              onClick={() => setSearchText('')}
            />
          }
          onChange={handleSearch}
        />
      </form>
      {pathname !== '/search' && !hideDropdown && searchText.length > 0 && (
        <div
          className={clsx('absolute mt-2 flex w-[94%] flex-col', modalWidthClassName)}
          ref={dropdownRef}
          data-testid="search-profiles-dropdown"
        >
          <div className="bg-dark max-h-[80vh] overflow-y-auto rounded-[2px] border border-gray-500">
            {searchUsersLoading ? (
              <div className="flex px-4 py-2 text-center text-sm font-medium uppercase text-white">
                <Spinner size="sm" className="mr-2" />
                <Trans>Searching users</Trans>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <div
                    key={profile?.handle}
                    className="hover:bg-darker cursor-pointer px-4 py-2 dark:hover:bg-gray-800"
                    onClick={() => {
                      if (onProfileSelected) {
                        onProfileSelected(profile);
                      }
                      setSearchText('');
                    }}
                    data-testid={`search-profile-${formatHandle(profile?.handle)}`}
                  >
                    <UserProfile
                      linkToProfile={!onProfileSelected}
                      profile={profile}
                      showUserPreview={false}
                    />
                  </div>
                ))}
                {profiles.length === 0 && (
                  <div className="px-4 py-2">
                    <Trans>No matching users</Trans>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
