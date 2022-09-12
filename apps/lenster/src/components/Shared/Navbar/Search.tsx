import { gql, useLazyQuery } from '@apollo/client';
import { Card } from '@components/UI/Card';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import { Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useRef, useState } from 'react';
import { SEARCH } from 'src/tracking';

import UserProfile from '../UserProfile';

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          ...ProfileFields
        }
      }
    }
  }
  ${ProfileFields}
`;

interface Props {
  hideDropdown?: boolean;
}

const Search: FC<Props> = ({ hideDropdown = false }) => {
  const { push, pathname, query } = useRouter();
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setSearchText(''));

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useLazyQuery(SEARCH_USERS_QUERY);

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    if (pathname !== '/search' && !hideDropdown) {
      searchUsers({
        variables: { request: { type: 'PROFILE', query: keyword, limit: 8 } }
      });
    }
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (pathname === '/search') {
      push(`/search?q=${searchText}&type=${query.type}`);
    } else {
      push(`/search?q=${searchText}&type=profiles`);
    }
    setSearchText('');
  };

  return (
    <>
      <div aria-hidden="true">
        <form onSubmit={handleKeyDown}>
          <Input
            type="text"
            className="py-2 px-3 text-sm"
            placeholder="Search..."
            value={searchText}
            onFocus={() => Mixpanel.track(SEARCH.FOCUS)}
            iconLeft={<SearchIcon />}
            iconRight={
              <XIcon
                className={clsx('cursor-pointer', searchText ? 'visible' : 'invisible')}
                onClick={() => {
                  setSearchText('');
                  Mixpanel.track(SEARCH.CLEAR);
                }}
              />
            }
            onChange={handleSearch}
          />
        </form>
      </div>
      {pathname !== '/search' && !hideDropdown && searchText.length > 0 && (
        <div className="flex absolute flex-col mt-2 w-full sm:max-w-md" ref={dropdownRef}>
          <Card className="overflow-y-auto py-2 max-h-[80vh]">
            {searchUsersLoading ? (
              <div className="py-2 px-4 space-y-2 text-sm font-bold text-center">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {searchUsersData?.search?.items?.map((profile: Profile) => (
                  <div key={profile?.handle} className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Link href={`/u/${profile?.handle}`} onClick={() => setSearchText('')}>
                      <UserProfile profile={profile} />
                    </Link>
                  </div>
                ))}
                {searchUsersData?.search?.items?.length === 0 && (
                  <div className="py-2 px-4">No matching users</div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default Search;
