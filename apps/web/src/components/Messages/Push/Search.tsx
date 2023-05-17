// import useGroupByName from '@components/utils/hooks/push/getGroupByName';
import UserProfile from '@components/Shared/UserProfile';
import useGetGroupByName from '@components/utils/hooks/push/useGetGroupbyName';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import type { GroupDTO } from '@pushprotocol/restapi';
import clsx from 'clsx';
import type { Profile, ProfileSearchResult } from 'lens';
import {
  CustomFiltersTypes,
  SearchRequestTypes,
  useSearchProfilesLazyQuery
} from 'lens';
import formatHandle from 'lib/formatHandle';
import { useRouter } from 'next/router';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { useAppStore } from 'src/store/app';
import type { ChatTypes } from 'src/store/push-chat';
import { usePushChatStore } from 'src/store/push-chat';
import { Card, Image, Input, Spinner } from 'ui';

import { getProfileFromDID } from './helper';
// import { GroupDTO } from '@pushprotocol/restapi';

interface SearchProps {
  hideDropdown?: boolean;
  onProfileSelected?: (type: ChatTypes, chatId: string) => void;
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
  const { fetchGroupByName } = useGetGroupByName();
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const currentProfile = useAppStore((state) => state.currentProfile);

  useOnClickOutside(dropdownRef, () => setSearchText(''));

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useSearchProfilesLazyQuery();
  const [groupData, setGroupData] = useState<GroupDTO | null>();
  const setInputRef = useRef<HTMLInputElement>(null);

  const handleImgClick = () => {
    if (setInputRef) {
      setInputRef.current ? setInputRef.current.focus() : null;
    }
  };

  const ifPrivateGroup = (groupInfo: GroupDTO) => {
    if (groupInfo && groupInfo.isPublic === false) {
      return true;
    }
    return false;
  };

  const ifGroupMember = (groupInfo: GroupDTO) => {
    let response = false;
    if (connectedProfile && connectedProfile?.did) {
      groupInfo?.members.map((member) => {
        if (member.wallet === connectedProfile.did) {
          response = true;
          return;
        }
      });
      groupInfo?.pendingMembers.map((member) => {
        if (member.wallet === connectedProfile.did) {
          response = true;
          return;
        }
      });
    } else {
      groupInfo?.members.map((member) => {
        if (getProfileFromDID(member.wallet) === currentProfile?.id) {
          response = true;
          return;
        }
      });
      groupInfo?.pendingMembers.map((member) => {
        if (getProfileFromDID(member.wallet) === currentProfile?.id) {
          response = true;
          return;
        }
      });
    }
    return response;
  };

  const handleSearch = async (evt: ChangeEvent<HTMLInputElement>) => {
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
      // Groups Data
      try {
        const response = await fetchGroupByName({ name: keyword });
        if (
          response &&
          (!ifPrivateGroup(response) ||
            (ifPrivateGroup(response) && ifGroupMember(response)))
        ) {
          setGroupData(response);
        }
      } catch (error) {
        setGroupData(null);
      }
    }
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (pathname === '/search') {
      push(`/search?q=${encodeURIComponent(searchText)}&type=${query.type}`);
    } else if (pathname === '/push') {
      push(`/search?q=${encodeURIComponent(searchText)}&type=profiles`);
    } else {
      push(`/search?q=${encodeURIComponent(searchText)}&type=groups`);
    }
    setSearchText('');
  };

  const searchResult = searchUsersData?.search as ProfileSearchResult;
  const isProfileSearchResult =
    searchResult && searchResult.hasOwnProperty('items');
  const profiles = isProfileSearchResult ? searchResult.items : [];

  return (
    <div
      aria-hidden="true"
      className="w-full"
      data-testid="global-search"
      ref={dropdownRef}
    >
      <form onSubmit={handleKeyDown} className="flex gap-x-2">
        <Input
          ref={setInputRef}
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
        <div className="cursor-pointer" onClick={handleImgClick}>
          <img
            className="h-10 w-11"
            src="/push/requestchat.svg"
            alt="plus icon"
          />
        </div>
      </form>
      {pathname !== '/search' && !hideDropdown && searchText.length > 0 && (
        <div
          className={clsx(
            'absolute mt-2 flex w-[20%] flex-col',
            modalWidthClassName
          )}
          data-testid="search-profiles-dropdown"
        >
          <Card className="z-10 max-h-[70vh] max-w-[340px] overflow-y-auto py-2	">
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
                  <div
                    key={profile?.handle}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      if (onProfileSelected) {
                        onProfileSelected('chat', profile.id);
                      }
                      setSearchText('');
                    }}
                    data-testid={`search-profile-${formatHandle(
                      profile?.handle
                    )}`}
                  >
                    <UserProfile
                      linkToProfile={!onProfileSelected}
                      profile={profile}
                      showUserPreview={true}
                    />
                  </div>
                ))}
                {groupData && groupData.groupName === searchText && (
                  <div
                    key={groupData.chatId}
                    className="flex cursor-pointer flex-row items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      if (onProfileSelected) {
                        onProfileSelected('group', groupData.chatId);
                      }
                      setSearchText('');
                    }}
                  >
                    <Image
                      src={groupData.groupImage ?? ''}
                      loading="lazy"
                      className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
                      height={40}
                      width={40}
                      alt={groupData.groupName}
                    />
                    <p className="bold max-w-[180px] truncate text-base leading-6">
                      {groupData.groupName}
                    </p>
                  </div>
                )}
                {profiles.length === 0 &&
                  (!groupData || groupData.groupName !== searchText) && (
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
