import { SearchIcon, XIcon } from '@heroicons/react/outline';
import type { Profile, ProfileSearchResult } from '@lenster/lens';
import {
  CustomFiltersTypes,
  SearchRequestTypes,
  useSearchProfilesLazyQuery
} from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { Card, Input, Spinner } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce, useOnClickOutside } from 'usehooks-ts';

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
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  useOnClickOutside(dropdownRef, () => setSearchText(''));

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useSearchProfilesLazyQuery();

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
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

  useEffect(() => {
    if (pathname !== '/search' && !hideDropdown) {
      searchUsers({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query: debouncedSearchText,
            customFilters: [CustomFiltersTypes.Gardeners],
            limit: 8
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  const searchResult = searchUsersData?.search as ProfileSearchResult;
  const isProfileSearchResult =
    searchResult && searchResult.hasOwnProperty('items');
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
          iconRight={
            <XIcon
              className={clsx(
                'cursor-pointer',
                searchText ? 'visible' : 'invisible'
              )}
              onClick={() => setSearchText('')}
            />
          }
          onChange={handleSearch}
        />
      </form>
      {pathname !== '/search' &&
        !hideDropdown &&
        debouncedSearchText.length > 0 && (
          <div
            className={clsx(
              'absolute mt-2 flex w-[94%] flex-col',
              modalWidthClassName
            )}
            ref={dropdownRef}
            data-testid="search-profiles-dropdown"
          >
            <Card className="z-[2] max-h-[80vh] overflow-y-auto py-2">
              {searchUsersLoading ? (
                <div className="space-y-2 px-4 py-2 text-center text-sm font-bold">
                  <Spinner size="sm" className="mx-auto" />
                  <div>
                    <Trans>Searching users</Trans>
                  </div>
                </div>
              ) : (
                <>
                  {profiles.map((profile: Profile) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={profile?.handle}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        if (onProfileSelected) {
                          onProfileSelected(profile);
                        }
                        setSearchText('');
                      }}
                      data-testid={`search-profile-${formatHandle(
                        profile?.handle
                      )}`}
                      aria-hidden="true"
                    >
                      <UserProfile
                        linkToProfile={!onProfileSelected}
                        profile={profile}
                        showUserPreview={false}
                      />
                    </motion.div>
                  ))}
                  {profiles.length === 0 && (
                    <div className="px-4 py-2">
                      <Trans>No matching users</Trans>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}
    </div>
  );
};

export default Search;
