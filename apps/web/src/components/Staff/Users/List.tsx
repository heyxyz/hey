import type {
  ExploreProfilesRequest,
  Profile,
  ProfileSearchRequest
} from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import P2PRecommendation from '@components/Shared/Profile/P2PRecommendation';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowPathIcon, UsersIcon } from '@heroicons/react/24/outline';
import {
  ExploreProfilesOrderByType,
  LimitType,
  useExploreProfilesQuery,
  useSearchProfilesLazyQuery
} from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Card, EmptyState, ErrorMessage, Input, Select } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useDebounce } from '@uidotdev/usehooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

const List: FC = () => {
  const { pathname } = useRouter();
  const [orderBy, setOrderBy] = useState<ExploreProfilesOrderByType>(
    ExploreProfilesOrderByType.LatestCreated
  );
  const [searchText, setSearchText] = useState('');
  const [refetching, setRefetching] = useState(false);
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  // Variables
  const request: ExploreProfilesRequest = {
    limit: LimitType.Fifty,
    orderBy
  };

  const { data, error, fetchMore, loading, refetch } = useExploreProfilesQuery({
    variables: { request }
  });

  const [searchUsers, { data: searchData, loading: searchLoading }] =
    useSearchProfilesLazyQuery();

  useEffect(() => {
    if (debouncedSearchText) {
      // Variables
      const request: ProfileSearchRequest = {
        limit: LimitType.Ten,
        query: debouncedSearchText
      };

      searchUsers({ variables: { request } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  const profiles = searchText
    ? searchData?.searchProfiles.items
    : data?.exploreProfiles.items;
  const pageInfo = data?.exploreProfiles?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    // Disable pagination when searching
    if (searchText) {
      return;
    }

    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  const onRefetch = async () => {
    setRefetching(true);
    await refetch();
    setRefetching(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <Input
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search profiles..."
          value={searchText}
        />
        {!searchText ? (
          <Select
            className="w-72"
            defaultValue={orderBy}
            onChange={(value) =>
              setOrderBy(value as ExploreProfilesOrderByType)
            }
            options={Object.values(ExploreProfilesOrderByType).map((type) => ({
              label: type,
              selected: orderBy === type,
              value: type
            }))}
          />
        ) : null}
        <button onClick={onRefetch} type="button">
          <ArrowPathIcon
            className={cn(refetching && 'animate-spin', 'size-5')}
          />
        </button>
      </div>
      <div className="divider" />
      <div className="m-5">
        {loading || searchLoading ? (
          <Loader className="my-10" message="Loading profiles..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load profiles" />
        ) : !profiles?.length ? (
          <EmptyState
            hideCard
            icon={<UsersIcon className="size-8" />}
            message={<span>No profiles</span>}
          />
        ) : (
          <Virtuoso
            computeItemKey={(index, profile) => `${profile.id}-${index}`}
            data={profiles}
            endReached={onEndReached}
            itemContent={(_, profile) => {
              return (
                <div className="flex flex-wrap items-center justify-between gap-y-5 pb-7">
                  <Link
                    href={
                      pathname === '/mod'
                        ? getProfile(profile as Profile).link
                        : getProfile(profile as Profile).staffLink
                    }
                  >
                    <UserProfile
                      hideFollowButton
                      hideUnfollowButton
                      isBig
                      linkToProfile={false}
                      profile={profile as Profile}
                      showBio={false}
                      showId
                      showUserPreview={false}
                      timestamp={profile.createdAt}
                    />
                  </Link>
                  <P2PRecommendation profile={profile as Profile} />
                </div>
              );
            }}
            useWindowScroll
          />
        )}
      </div>
    </Card>
  );
};

export default List;
