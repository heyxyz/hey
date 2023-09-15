import UserProfile from '@components/Shared/UserProfile';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import type { Profile, ProfileSearchResult } from '@lenster/lens';
import {
  CustomFiltersTypes,
  SearchRequestTypes,
  useSearchProfilesLazyQuery
} from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { Card, Input, Spinner } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { t, Trans } from '@lingui/macro';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useDebounce, useOnClickOutside } from 'usehooks-ts';

interface SearchProps {
  placeholder?: string;
  modalWidthClassName?: string;
  label?: string;
}

const Search: FC<SearchProps> = ({
  placeholder = t`Search…`,
  modalWidthClassName = 'max-w-md',
  label
}) => {
  const { push, pathname, query } = useRouter();
  const { setTokenGateConditionValue, tokenGateConditionValue } =
    useSpacesStore();

  const [searchText, setSearchText] = useState(tokenGateConditionValue);
  const dropdownRef = useRef(null);
  const debouncedSearchText = useDebounce<string>(searchText, 500);
  const [hideDropdown, setHideDropdown] = useState(true);

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

    if (hideDropdown && searchText !== tokenGateConditionValue) {
      setHideDropdown(false);
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
          label={label ? t`${label}` : undefined}
          className="px-3 py-2 text-sm"
          placeholder={placeholder}
          value={searchText}
          iconLeft={<SearchIcon />}
          iconRight={
            <XIcon
              className={cn(
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
      debouncedSearchText.length > 0 ? (
        <div
          className={cn(
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
                      setTokenGateConditionValue(profile?.handle);
                      setSearchText(profile.handle);
                      setHideDropdown(true);
                    }}
                    data-testid={`search-profile-${formatHandle(
                      profile?.handle
                    )}`}
                    aria-hidden="true"
                  >
                    <UserProfile
                      linkToProfile={false}
                      profile={profile}
                      showUserPreview={false}
                    />
                  </motion.div>
                ))}
                {profiles.length === 0 ? (
                  <div className="px-4 py-2">
                    <Trans>No matching users</Trans>
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
