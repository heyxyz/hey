import type { Profile, ProfileSearchRequest } from '@hey/lens';
import type { ChangeEvent, FC } from 'react';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesLazyQuery
} from '@hey/lens';
import { Card, Input, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDebounce, useOnClickOutside } from 'usehooks-ts';

import UserProfile from '../UserProfile';

interface SearchProps {
  hideDropdown?: boolean;
  onProfileSelected?: (profile: Profile) => void;
  placeholder?: string;
}

const Search: FC<SearchProps> = ({
  hideDropdown = false,
  onProfileSelected,
  placeholder = 'Search…'
}) => {
  const { pathname, push, query } = useRouter();
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
    if (pathname !== '/search' && !hideDropdown && debouncedSearchText) {
      // Variables
      const request: ProfileSearchRequest = {
        limit: LimitType.Ten,
        query: debouncedSearchText,
        where: { customFilters: [CustomFiltersType.Gardeners] }
      };

      searchUsers({ variables: { request } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  const searchResult = searchUsersData?.searchProfiles;
  const profiles = (searchResult?.items as Profile[]) || [];

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
              onClick={() => setSearchText('')}
            />
          }
          onChange={handleSearch}
          placeholder={placeholder}
          type="text"
          value={searchText}
        />
      </form>
      {pathname !== '/search' &&
      !hideDropdown &&
      debouncedSearchText.length > 0 ? (
        <div
          className="absolute mt-2 flex w-[94%] max-w-md flex-col"
          ref={dropdownRef}
        >
          <Card className="z-[2] max-h-[80vh] overflow-y-auto py-2">
            {searchUsersLoading ? (
              <div className="space-y-2 px-4 py-2 text-center text-sm font-bold">
                <Spinner className="mx-auto" size="sm" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {profiles.map((profile) => (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key={profile.id}
                    onClick={() => {
                      if (onProfileSelected) {
                        onProfileSelected(profile);
                      }
                      setSearchText('');
                    }}
                  >
                    <UserProfile
                      linkToProfile={!onProfileSelected}
                      profile={profile}
                      showUserPreview={false}
                    />
                  </motion.div>
                ))}
                {profiles.length === 0 ? (
                  <div className="px-4 py-2">No matching users</div>
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
